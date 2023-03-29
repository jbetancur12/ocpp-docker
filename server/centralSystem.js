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
import Cost from './models/cost.model';
import cookieParser from 'cookie-parser';

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

    const getChargerPointId = async (connectionUrl) => {
        const chargerPoint = await ChargerPoint.findOne({ charger_box_id: connectionUrl.slice(1) }, '_id')
        return chargerPoint._id
      }
      
      const getUserId = async (idTag) => {
        const user = await User.findOne({ id_tag: idTag }, 'id_tag')
        return user && user._id ? user._id : "6414f16aca152004ab6afc4d"
      }
      
      const getNextSequenceId = async () => {
        let seq
        const count = await TransactionId.findOneAndUpdate(
          { id: "transactionIDCount" },
          { "$inc": { "transactionId": 1 } },
          { new: true }
        )
        if (count == null) {
          const newVal = new TransactionId({ id: "transactionIDCount", transactionId: 1 })
          newVal.save()
          seq = 1
        } else {
          seq = count.transactionId
        }
        return seq
      }
      
      const createTransaction = async (chargerPointId, userId, command, sequenceId) => {
        const dataTransaction = new Transaction({
          chargerPointId,
          transactionId: sequenceId,
          user: userId,
          connectorId: command.connectorId,
          start_timestamp: command.timestamp,
          start_value: command.meterStart,
          stop_timestamp: command.timestamp,
          stop_value: command.meterStart
        })
        return dataTransaction.save()
      }
      
      const handleStartTransactionCommand = async (client, command) => {
      
        client.payload = {
          command: "StartTransaction",
          data: { ...command },
        };
        await cSystem.onStatusUpdate();
      
        const chargerPointId = await getChargerPointId(client.connection.url)
        const userId = await getUserId(command.idTag)
        const seq = await getNextSequenceId()

      
        const transaction = await createTransaction(chargerPointId, userId, command, seq)

      
        return {
          transactionId: seq,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED,
          },
        };
      };

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

                // client.payload = {
                //     command: "StartTransaction",
                //     data: { ...command },
                // };
                // await cSystem.onStatusUpdate();

                // const url = client.connection.url
                // const CP = await ChargerPoint.find({ charger_box_id: url.slice(1) }, '_id')
                // const userId = await User.find({ id_tag: command.idTag }, 'id_tag')
                // console.log("🚀 ~ file: centralSystem.js:125 ~ userId:", userId)
                // const _userId = []
                // let seq;


                // if (userId.length == 0) {
                //     _userId.push("6414f16aca152004ab6afc4d")
                // } else {
                //     _userId.push(userId[0]._id)
                // }

                // await TransactionId.findOneAndUpdate(
                //     { id: "transactionIDCount" },
                //     { "$inc": { "transactionId": 1 } },
                //     { new: true }, (err, cd) => {
                //         let seqId;
                //         if (cd == null) {
                //             const newVal = new TransactionId({ id: "transactionIDCount", transactionId: 1 })
                //             newVal.save()
                //             seqId = 1
                //         } else {
                //             seqId = cd.transactionId
                //         }
                //         seq = seqId
                //         const dataTransaction = new Transaction({
                //             chargerPointId: CP[0]._id,
                //             transactionId: seq,
                //             user: _userId[0],
                //             connectorId: command.connectorId,
                //             start_timestamp: command.timestamp,
                //             start_value: command.meterStart,
                //             stop_timestamp: command.timestamp,
                //             stop_value: command.meterStart
                //         })

                //         console.log("🚀 ~ file: centralSystem.js:149 ~ dataTransaction:", dataTransaction)
                //         dataTransaction.save()


                      


                //     }
                // )

                // return {
                //     transactionId: 98,
                //     idTagInfo: {
                //         status: StartTransactionConst.STATUS_ACCEPTED,
                //     },
                // };
                
                const data = handleStartTransactionCommand(client, command)
                return data


            case command instanceof OCPPCommands.StopTransaction:
                client.payload = {
                    command: "StopTransaction",
                    data: { ...command },
                };

                await cSystem.onStatusUpdate();

                //REVISAR BIEN ESTA PARTE

                function getCost(rate) {
                    return rate.type_ === "energy";
                  }

                const CP = await Transaction.findOne({ transactionId: command.transactionId }).select('chargerPointId')
                const Costs = await ChargerPoint.findById(CP.chargerPointId).populate("rates")
                console.log("🚀 ~ file: centralSystem.js:265 ~ Costs:", Costs)
                const cost = Costs.rates.priceComponents.find(getCost)

                const rawPrice = parseInt(cost.price) * (parseInt(command.meterStop)/1000)              
                const tax =  parseInt(rawPrice)*(parseInt(cost.price)/100)          
                const unitPrice = rawPrice + tax
    
                

                const m = await Transaction.findOneAndUpdate({ transactionId: command.transactionId }, { stop_value: command.meterStop, stop_timestamp: command.timestamp, cost: unitPrice }, { new: true })
                // await Transaction.updateOne({transactionId:command.transactionId },[{$set:{time:{$dateDiff:{
                //     startDate:"$start_timestamp",endDate: new Date(command.timestamp), unit:"hour"}}}}])
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

                // const CP = await ChargerPoint.findOneAndUpdate({'charger_box_id': `/${client.connection.url}`},{'$set':{
                //     "connectors.$[1].status":command.status
                // }},{useFindAndModify: false})

                console.log(client.connection.url)

                // const CP = await ChargerPoint.find({'charger_box_id': `${client.connection.url.substring(1)}`})

                const cpFinder = () => {
                    return ChargerPoint.findOne({"charger_box_id": `${client.connection.url.substring(1)}`})
                  }
                  
                  const cpUpdater = (cp, command) => {
                    cp.connectors[command.connectorId - 1].status = command.status;   
                    cp.connectors[command.connectorId - 1].errorCode = command.errorCode; 
                    cp.connectors[command.connectorId - 1].info = command.info; 
                    return cp.save();
                  }
                  
                  cpFinder().then(cp => {
                    cpUpdater(cp, command).then(result => {
                      console.log(result);
                    }).catch(err => {
                      console.error('ERROR!');
                    });
                  }).catch(err => {
                    console.error('ERROR!');
                  });

                // ChargerPoint.findOne({"charger_box_id": `${client.connection.url.substring(1)}`}, function (err, cp) {
                //     cp.connectors[command.connectorId - 1].status = command.status;   
                //     cp.connectors[command.connectorId - 1].errorCode = command.errorCode; 
                //     cp.connectors[command.connectorId - 1].info = command.info;       
                    
                //     cp.save(function (err) {
                //         if(err) {
                //             console.error('ERROR!');
                //         }
                //     });
                // });
                
                //console.log("🚀 ~ file: centralSystem.js:310 ~ CP ~ CP:", CP)
                

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


        let command = new OCPPCommands.TriggerMessage({
            requestedMessage: requestedMessage,
        })



        return await client.connection.send(command);

    }



    cSystem.setConfig = async (client, data) => {





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

        console.log("===>", connectorId, idTag)

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
