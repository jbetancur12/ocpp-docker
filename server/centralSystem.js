import { CentralSystem, OCPPCommands } from './ocpp/src';
import * as AuthorizeConst from './ocpp/src/commands/Authorize';
import * as StartTransactionConst from './ocpp/src/commands/StartTransaction';
import OCPPError, { ERROR_NOTIMPLEMENTED } from './ocpp/src/ocppError';
import * as BootNotificationConst from './ocpp/src/commands/BootNotification';
import * as StatusNotificationConst from './ocpp/src/commands/StatusNotification';
import ChargerPoint from './models/chargerPoint.model';
import Transaction from './models/transaction.model';
import authCtrl from './controllers/user.controller';
import TransactionId from './models/transactionId.model';
import User from './models/user.model';

const getCPData = (payload) => {
    return {
        charge_point_vendor: payload.chargePointVendor || '',
        charge_point_model: payload.chargePointModel || '',
        charge_point_serial_number: payload.chargePointSerialNumber || '',
        charge_box_serial_number: payload.chargeBoxSerialNumber || '',
        fw_version: payload.firmwareVersion || '',
        iccid: payload.iccid || '',
        imsi: payload.imsi || '',
        meter_type: payload.meterType || '',
        meter_serial_number: payload.meterSerialNumber || '',
        registration_status: 'Accepted',
    };
};

const concatenate = (command, client) => {
    const ui = Math.round(Date.now() + Math.random());
    const connectorIdx = client.info.connectors.findIndex((item) => {
        return command.connectorId === item.connectorId;
    });

    const uid = '' + ui + client.info.connectors[connectorIdx].connectorId;
    if (connectorIdx === -1) {
        client.info.connectors.push({});
    } else {
        client.info.connectors[connectorIdx] = {
            ...client.info.connectors[connectorIdx],
            ...{ transactionId: uid },
        };
        return uid;
    }
};

export function createServer(server) {
    const cSystem = new CentralSystem({
        validateConnection,
        wsOptions: { server },
    });

    cSystem.listen(null);

    cSystem.onStatusUpdate = async function () { };

    cSystem.onRequest = async function (client, command) {
        const connection = client.connection;

       // console.info(`New command from ${connection.url}`);


        switch (true) {
            case command instanceof OCPPCommands.BootNotification:
                client.payload = {
                    command: "BootNotification",
                    data: { ...command },
                };


                let chargerPoint = await ChargerPoint.findOne({
                    charger_box_id: connection.url.substring(1),
                });


                if (!chargerPoint) {
                    console.info('ChargerPoint does not exist in DB');
                    return {
                        status: BootNotificationConst.STATUS_REJECTED,
                        currentTime: new Date().toISOString(),
                        interval: 30,
                    };
                }

                console.info('ChargerPoint  exists in DB');

                await ChargerPoint.findByIdAndUpdate(
                    chargerPoint._id,
                    getCPData(command),
                );
                await cSystem.onStatusUpdate();
                return {
                    status: BootNotificationConst.STATUS_ACCEPTED,
                    currentTime: new Date().toISOString(),
                    interval: 28800, // 8 horas
                };

            case command instanceof OCPPCommands.Authorize:
                return {
                    idTagInfo: {
                        status: AuthorizeConst.STATUS_ACCEPTED,
                    },
                };

            case command instanceof OCPPCommands.MeterValues:
                console.log("🚀 ~ file: centralSystem.js:105 ~ command:", command)
                client.payload = {
                    command: "MeterValues",
                    data: { ...command },
                };
                await cSystem.onStatusUpdate();

                return null;

            case command instanceof OCPPCommands.StartTransaction:

                client.payload = {
                    command: "StartTransaction",
                    data: { ...command },
                };
                await cSystem.onStatusUpdate();

                const url = client.connection.url
                const CP = await ChargerPoint.find({ charger_box_id: url.slice(1) }, '_id')
                const userId = await User.find({id_tag: command.idTag},'_id')

                await TransactionId.findOneAndUpdate(
                    { id: "transactionIDCount" },
                    { "$inc": { "transactionId": 1 } },
                    { new: true }, (err, cd) => {
                        let seqId;
                        if (cd == null) {
                            const newVal = new TransactionId({ id: "transactionIDCount", transactionId: 1 })
                            newVal.save()
                            seqId = 1
                        } else {
                            seqId = cd.transactionId
                        }
                        console.log("======>",seqId)
                        const dataTransaction = new Transaction({
                            chargerPointId: CP[0]._id,
                            transactionId: seqId,
                            user: userId[0]._id,
                            connectorId: command.connectorId,
                            start_timestamp: command.timestamp,
                            start_value: command.meterStart,
                            stop_timestamp: command.timestamp,
                            stop_value: command.meterStart
                        })
                        console.log("🚀 ~ file: centralSystem.js:149 ~ dataTransaction:", dataTransaction)
                        
                        dataTransaction.save()

                    }
                )

                return {
                    transactionId: seqId,
                    idTagInfo: {
                        status: StartTransactionConst.STATUS_ACCEPTED,
                    },
                };




            case command instanceof OCPPCommands.StopTransaction:
                client.payload = {
                    command: "StopTransaction",
                    data: { ...command },
                };

                await cSystem.onStatusUpdate();

                const m = await Transaction.findOneAndUpdate({ transactionId: command.transactionId }, { stop_value: command.meterStop, stop_timestamp: command.timestamp }, { new: true })
                return {
                    transactionId: command.transactionId,
                    idTagInfo: {
                        status: StartTransactionConst.STATUS_ACCEPTED,
                    },
                };

            case command instanceof OCPPCommands.Heartbeat:
                return {
                    currentTime: new Date().toISOString(),
                };



            case command instanceof OCPPCommands.StatusNotification:
                // client.info = client.info || {};
                // client.info.connectors = client.info.connectors || [];

                // const connectorIndex = client.info.connectors.findIndex((item) => {
                //     return command.connectorId === item.connectorId;
                // });


                // if (connectorIndex === -1) {
                //     client.info.connectors.push({
                //         ...command,
                //     });
                // } else {
                //     client.info.connectors[connectorIndex] = {
                //         ...command,
                //     };
                // }

                // client.info.payload = command

                client.payload = {
                    command: "StatusNotification",
                    data: { ...command },
                };
                await cSystem.onStatusUpdate();


                return {};
            default:
                throw new OCPPError(ERROR_NOTIMPLEMENTED, 'Unknown command');
        }

    };

    cSystem.reset = async (client) => {

        let command = new OCPPCommands.Reset({
            type: "Soft"
        });



        return await client.connection.send(command);

    }

    cSystem.getConf = async (client) => {
    //console.log("🚀 ~ file: centralSystem.js:235 ~ cSystem.getConf= ~ client:", client)


        let command = new OCPPCommands.GetConfiguration()


        return await client.connection.send(command);

    }

    cSystem.triggerMessage = async (client, requestedMessage) => {
    console.log("🚀 ~ file: centralSystem.js:243 ~ cSystem.triggerMessage= ~ client:", client)

        let command = new OCPPCommands.TriggerMessage({
            requestedMessage: requestedMessage,
        })



        return await client.connection.send(command);

    }



    cSystem.setConfig = async (client, data) => {

        console.log('%ccentralSystem.js line:192 data', 'color: #007acc;', data);



        let command = new OCPPCommands.ChangeConfiguration(data)


        return await client.connection.send(command);

    }

    cSystem.unlock = async (client) => {

        let command = new OCPPCommands.UnlockConnector({ connectorId: 1 })


        return await client.connection.send(command);

    }

    cSystem.clearCache = async (client) => {

        let command = new OCPPCommands.ClearCache()


        return await client.connection.send(command);

    }

    cSystem.stop = async (client, tId) => {
        let command = new OCPPCommands.RemoteStopTransaction({
            transactionId: tId
        });

        return await client.connection.send(command);
    }

    cSystem.toggleChargePoint = async (
        client,
        connectorId,
        idTag
    ) => {
        console.log("🚀 ~ file: centralSystem.js:279 ~ createServer ~ idTag", idTag)


        // const connector = client.info.connectors.find(
        //     (item) => connectorId.toString() === item.connectorId.toString(),
        // );
        // if (!connector) {
        //     return null;
        // }

        // if (connector.status !== StatusNotificationConst.STATUS_AVAILABLE) {
        //     let command = new OCPPCommands.RemoteStopTransaction({
        //         transactionId: connectorId,
        //     });
        //     return await client.connection.send(command);

        // }

        let command = new OCPPCommands.RemoteStartTransaction({
            connectorId: connectorId,
            idTag,
        });

        return await client.connection.send(command);
    };
    return cSystem;

    async function validateConnection(url) {
        let chargerPoint = await ChargerPoint.findOne({
            charger_box_id: url.substring(1),
        });

        if (chargerPoint) {
            return true;
        }
        return false;
    }
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
