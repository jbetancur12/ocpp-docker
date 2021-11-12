import ChargerPoint from '../models/chargerPoint.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';

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
    let chargerPoint = await ChargerPoint.findById(id);
    if (!chargerPoint)
      return res.status('400').json({
        error: 'ChargerPoint not found',
      });
    req.profile = chargerPoint;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve chargerPoint',
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

export default { create, chargerPointByID, read, list, remove, update };
