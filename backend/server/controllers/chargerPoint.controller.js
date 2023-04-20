import ChargerPoint from '../models/chargerPoint.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import { centralSystem } from '../server';
import _ from 'lodash';
import TransactionId from '../models/transactionId.model';
import Transaction from '../models/transaction.model';
import Location from '../models/location.model';

const create = async (req, res) => {
    const chargerPoint = new ChargerPoint(req.body);
  
    try {
      const cp = await chargerPoint.save();
      const CPlocation = cp.location;
      await Location.findByIdAndUpdate(
        CPlocation,
        { $push: { chargerPoints: cp._id } },
        { new: true, useFindAndModify: false },
      );
      return res.status(200).json({
        message: 'Charger Point Successfully created!',
      });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  };

const list = async (req, res) => {
    try {
        let chargerPoints = await ChargerPoint.find().populate("location");
        res.json(chargerPoints);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const chargerPointByID = async (req, res, next, id) => {
    console.log("JJJJJ")
    try {
        let chargerPoint = await ChargerPoint.find({ _id: id });

        if (!chargerPoint)
            return res.status('400').json({
                error: 'ChargerPoint not found',
            });
        req.cp = chargerPoint;
        next();
    } catch (err) {
        return res.status('400').json({
            error: 'Could not retrieve chargerPoint',
        });
    }
};

const read = async (req, res) => {
    // console.log(req)
     try {
        let chargerPoint = await ChargerPoint.findOne({
            charger_box_id: req.params.station,
        });
        if (!chargerPoint)
            return res.status('400').json({
                error: 'ChargerPoint not found',
            });
        res.json(chargerPoint);
    } catch (err) {
        return res.status('400').json({
            error: 'Could not retrieve chargerPoint',
        });
    }
};

const update = async (req, res) => {
    try {
      const chargerPointId = req.params.station;
      const updatedChargerPoint = req.body;
    
      const updatedCp = await ChargerPoint.findOneAndUpdate(
        { _id: chargerPointId },
        { $set: updatedChargerPoint },
        { new: true }
      );
    
      console.log("🚀 ~ file: chargerPoint.controller.js:82 ~ update ~ req:", updatedCp)
    
      const CPlocation = updatedCp.location;
      await Location.findByIdAndUpdate(
        CPlocation,
        { $push: { chargerPoints: updatedCp._id } },
        { new: true }
      );
        
      res.json(updatedCp);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  };

const onlineCps = async (req, res) => {

    console.log("Entro")
    try {
        let chargerPoints = await ChargerPoint.aggregate([
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 } // this means that the count will increment by 1
              }
            }
          ]);
          res.json(chargerPoints);
        } catch (err) {
            return res.status(400).json({
                error: err,
            });
        }
}

const addConnector = async (req,res)=>{
    try {
        const [chargerPoint] = req.cp;

        for (const connector of req.body) {
          chargerPoint.connectors.push(connector);
        }
        
        chargerPoint.updated = Date.now();
        
        await chargerPoint.save();
        
        res.json(chargerPoint);
        
    } catch (error) {
        return res.status(400).json({
            error: error,
        });
    }
}

const reset = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });


    if (idf !== -1) {
        const result = await centralSystem.reset(
            centralSystem.clients[idf]
        );

        //console.log(result)
        res.write(JSON.stringify(result));
    }
    res.end();
    return;
}

const getConf = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });


    if (idf !== -1) {
    //f (true) {
        const result = await centralSystem.getConf(
            // Cambiar
             centralSystem.clients[idf]
           // centralSystem.clients[0]
        );
        res.write(JSON.stringify(result));
    }else {
        res.write("No se encontro conexcion con el CP")
    }
    res.end();
    return;
}

const triggerMessage = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });

   // console.log(idf)

    if (idf !== -1)  {
        const result = await centralSystem.triggerMessage(
            centralSystem.clients[0],
            "MeterValues"
        );
        res.write(JSON.stringify(result));
    }else {
        res.write("No se encontro conexcion con el CP")
    }
    res.end();
    return;
}

const unlock = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });




    if (idf !== -1) {
        const result = await centralSystem.unlock(
            centralSystem.clients[idf]
        );
        res.write(JSON.stringify(result));
    }
    res.end();
    return;
}

const clearCache = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });

    if (idf !== -1) {
        const result = await centralSystem.clearCache(
            centralSystem.clients[idf]
        );
        res.write(JSON.stringify(result));
    }
    res.end();
    return;
}

const remoteStart = async (req, res) => {
    
    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });
    


    if (idf !== -1) {
        
           const ms = await centralSystem.toggleChargePoint(
            centralSystem.clients[idf],
            parseInt(req.body.connector),
            "83FA81A40292",
            //req.body.transactionId
        );
        res.write(JSON.stringify(ms));
    } else {
        res.write("No se encontro conexcion con el CP")
    }
    res.end();
    return;
};

const stop = async (req, res) => {
    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });


    if (idf !== -1) {
        const client = centralSystem.clients[idf].connection.req.url.slice(1)

        const CP = await ChargerPoint.findOne({ charger_box_id: client })

        const transactionId = await Transaction.find({ chargerPointId: CP._id }).sort({ createdAt: -1 }).limit(1)
   

        const ms = await centralSystem.stop(
            centralSystem.clients[idf],
            transactionId[0].transactionId
        );
        res.write(JSON.stringify(ms));
    }
    res.end();
    return;
};

const setConfig = async (req, res) => {
    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });
    
    const {data} = req.body   
 
   // Cambiar
   if (idf !== -1) {
    //if (true) {
        const ms = await centralSystem.setConfig(

            centralSystem.clients[0],
           data
        );
        res.write(JSON.stringify(ms));
    }else {
        res.write("No se encontro conexcion con el CP")
    }
    res.end();
    return;
};



const remove = async (req, res) => {
    try {
        const deletedObject = await ChargerPoint.findByIdAndRemove(req.params.station);
        res.status(200).json(deletedObject);
      } catch (error) {
        console.error(error);
      }
};

const clients = async (req, res) => {
    try {
        const getClients = centralSystem.clients.map(
            (client) => client.connection.req.url,
        );
        res.json(getClients);
    } catch (error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const status = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    onDigits2(req, res);
    centralSystem.onStatusUpdate = () => onDigits2(req, res);
};

function onDigits2(req, res) {

    const data = centralSystem.clients.map((client) => {
        return { timeStamp: (new Date()).toLocaleString("en-US", {timeZone: "America/Bogota"}), ocpp: { id: client.connection.req.url }, payload: client.payload };
    });

    res.write(`data: ${JSON.stringify(data)}\n\n`);

    res.on('close', () => {

        res.end();
    });
}

function onDigits(req, res) {

    const intervalId = setInterval(() => {
        const data = centralSystem.clients.map((client) => {
            return { id: client.connection.req.url, ...client.info };
        });

        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 5000);

    res.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}

export default {
    create,
    chargerPointByID,
    read,
    list,
    remove,
    update,
    addConnector,
    status,
    clients,
    remoteStart,
    reset,
    getConf,
    triggerMessage,
    clearCache,
    unlock,
    stop,
    setConfig,
    onlineCps
};
