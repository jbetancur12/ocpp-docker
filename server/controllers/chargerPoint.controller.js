import ChargerPoint from "../models/chargerPoint.model";
import extend from "lodash/extend";
import errorHandler from "../helpers/dbErrorHandler";
import { centralSystem } from "../server";
import _ from 'lodash'

const create = async (req, res) => {
  const chargerPoint = new ChargerPoint(req.body);
  try {
    await chargerPoint.save();
    return res.status(200).json({
      message: "Charger Point Successfully created!",
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
    let chargerPoint = await ChargerPoint.findById(id);
    if (!chargerPoint)
      return res.status("400").json({
        error: "ChargerPoint not found",
      });
    req.profile = chargerPoint;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve chargerPoint",
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let chargerPoint = req.profile;
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

const remoteStart = async (req, res) => {
  console.log(req.params)
  const idf = _.findIndex(centralSystem.clients, function(o){return o.connection.req.url === `/${req.params.id}`})
  if(idf !== -1){
    const result = await centralSystem.toggleChargePoint(centralSystem.clients[idf], req.params.conector);
    res.write(JSON.stringify({}));
  }
  res.json({})
};

const remove = async (req, res) => {
  try {
    let chargerPoint = req.profile;
    let deleteCP = await chargerPoint.remove();
    deleteCP.hashed_password = undefined;
    deleteCP.salt = undefined;
    res.json(deleteCP);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const status = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const intervalId = setInterval(() => {
    const date = new Date().toLocaleString();
    res.write(`data: ${date}\n\n`);
  }, 1000);

  res.on("close", () => {
    console.log("Client closed connection");
    clearInterval(intervalId);
    res.end();
  });
};

const clients = async (req, res) => {
  console.log("Client Connected");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  onDigits(req, res);
  centralSystem.onStatusUpdate = () => onDigits(req, res);
};

function onDigits(req, res) {
  const intervalId = setInterval(() => {
    const data = centralSystem.clients.map((client) => {
      return {id: client.connection.req.url, ...client.info};
    })

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  res.on("close", () => {
    console.log("Client closed connection");
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
  remoteStart
};
