import Location from '../models/location.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = async (req, res) => {

    const location = new Location(req.body);
    try {
        await location.save();
        return res.status(200).json({
            message: 'Location Successfully created!',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const list = async (req, res) => {
    try {
      const locations = await Location.find().populate('chargerPoints', "status charger_box_id connectors");
      res.json(locations);
    } catch (error) {
      res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
  };


export default {
    create,list
};
