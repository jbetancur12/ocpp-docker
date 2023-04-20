import { CentralSystem, OCPPCommands } from './ocpp/src';
import * as AuthorizeConst from './ocpp/src/commands/Authorize';
import * as StartTransactionConst from './ocpp/src/commands/StartTransaction';
import OCPPError, { ERROR_NOTIMPLEMENTED } from './ocpp/src/ocppError';
import * as BootNotificationConst from './ocpp/src/commands/BootNotification';
import ChargerPoint from './models/chargerPoint.model';
import Transaction from './models/transaction.model';
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

const cpFinder = (cp) => {
    return ChargerPoint.findOne({"charger_box_id": cp})
  }
  
  const cpUpdater = (cp, command) => {
    cp.connectors[command.connectorId - 1].status = command.status;   
    cp.connectors[command.connectorId - 1].errorCode = command.errorCode; 
    cp.connectors[command.connectorId - 1].info = command.info; 
    return cp.save();
  }


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
          { new: true },
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

    cSystem.isAliveF = async function(client){
        client.connection.socket.isAlive = true 
        cpFinder(client.connection.url.substring(1)).then(cp => {
            cp.status = "online"
            cp.save()
          }).catch(err => {
            console.error('ERROR!');
          }); 

    }

    cSystem.connectionClose = async function (client) {
        client.connection.socket.isAlive = false 
        cpFinder(client.connection.url.substring(1)).then(cp => {
            cp.status = "offline"
            cp.save()
          }).catch(err => {
            console.error('ERROR!');
          }); 

        
    }




    


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

                // client.connection.socket.isAlive = online 
                // cpFinder(client.connection.url.substring(1)).then(cp => {
                //     cp.status = "online"
                //     cp.save()
                //   }).catch(err => {
                //     console.error('ERROR!');
                //   });


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
                //console.log("🚀 ~ file: centralSystem.js:105 ~ command:", command)
                client.payload = {
                    command: "MeterValues",
                    data: { ...command },
                };
                await cSystem.onStatusUpdate();

                return null;

            case command instanceof OCPPCommands.StartTransaction:

                
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
                //console.log("🚀 ~ file: centralSystem.js:265 ~ Costs:", Costs)
                const cost = Costs.rates.priceComponents.find(getCost)

                const rawPrice = parseInt(cost.price) * (parseInt(command.meterStop)/1000)              
                const tax =  parseInt(rawPrice)*(parseInt(cost.tax)/100)          
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
            
           
                  
                  cpFinder(client.connection.url.substring(1)).then(cp => {
                    cpUpdater(cp, command).then(result => {
           
                    }).catch(err => {
                      console.error('ERROR!');
                    });
                  }).catch(err => {
                    console.error('ERROR!');
                  });           
                

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

