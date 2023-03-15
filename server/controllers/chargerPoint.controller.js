import ChargerPoint from '../models/chargerPoint.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import { centralSystem } from '../server';
import _ from 'lodash';
import TransactionId from '../models/transactionId.model';
import Transaction from '../models/transaction.model';

const create = async (req, res) => {
    const chargerPoint = new ChargerPoint(req.body);
    try {
        await chargerPoint.save();
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
        let chargerPoints = await ChargerPoint.find();
        res.json(chargerPoints);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const chargerPointByID = async (req, res, next, id) => {

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
    console.log('%cchargerPoint.controller.js line:51 req.params.station', 'color: #007acc;', req.params.station);
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
        let chargerPoint = req.cp;
        chargerPoint = extend(chargerPoint, req.body);
        chargerPoint.updated = Date.now();
        await chargerPoint.save();
        res.json(chargerPoint);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const reset = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });


    if (idf !== -1) {
        const result = await centralSystem.reset(
            centralSystem.clients[idf]
        );

        console.log(result)
        res.write(JSON.stringify(result));
    }
    res.end();
    return;
}

const getConf = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });


    // Cambiar

    // if (idf !== -1) {
    if (true) {
        const result = await centralSystem.getConf(
            // Cambiar
            // centralSystem.clients[idf]
            centralSystem.clients[0]
        );
        res.write(JSON.stringify(result));
    }
    res.end();
    return;
}

const triggerMessage = async (req, res) => {

    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });



    if (true) {
        const result = await centralSystem.triggerMessage(
            centralSystem.clients[0],
            "MeterValues"
        );
        res.write(JSON.stringify(result));
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
        console.log("🚀 ~ file: chargerPoint.controller.js:161 ~ idf ~ idf", o.connection.req.url)
        console.log("🚀 ~ file: chargerPoint.controller.js:162 ~ idf ~ idf", req.body.id)
        return o.connection.req.url === `${req.body.id}`;
    });
    
    console.log("🚀 ~ file: chargerPoint.controller.js:161 ~ idf ~ idf", idf)

    if (idf !== -1) {
        
        console.log("🚀 ~ file: chargerPoint.controller.js:167 ~ remoteStart ~ req.profile", req.profile)
        const ms = await centralSystem.toggleChargePoint(
            centralSystem.clients[idf],
            parseInt(req.body.connector),
            req.profile.id_tag,
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
        console.log("🚀 ~ file: chargerPoint.controller.js:187 ~ stop ~ client", client)
        const transactionId = await Transaction.find({ charger_box_id: client }).sort({ createdAt: -1 }).limit(1)
        console.log("🚀 ~ file: chargerPoint.controller.js:188 ~ stop ~ transactionId", transactionId[0].transactionId)

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
    console.log("🚀 ~ file: chargerPoint.controller.js:230 ~ req:", req.body)
    const idf = _.findIndex(centralSystem.clients, function (o) {
        return o.connection.req.url === `${req.body.id}`;
    });

   // Cambiar
   // if (idf !== -1) {
    if (true) {
        const ms = await centralSystem.setConfig(
            // Cambiar
            // centralSystem.clients[idf],
            centralSystem.clients[0],
            req.body
        );
        res.write(JSON.stringify(ms));
    }
    res.end();
    return;
};



const remove = async (req, res) => {
    try {
        let chargerPoint = req.cp;
        await ChargerPoint.deleteOne({ charger_box_id: chargerPoint.charger_box_id }).then(function (data) {
            res.json(data);
            console.log(data); // Success
        }).catch(function (error) {
            console.log(error); // Failure
        });
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
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
        return { ocpp: { id: client.connection.req.url }, payload: client.payload };
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
    status,
    clients,
    remoteStart,
    reset,
    getConf,
    triggerMessage,
    clearCache,
    unlock,
    stop,
    setConfig
};
