import Cost from '../models/cost.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = async (req, res) => {
    const cost = new Cost(req.body);
    try {
        await cost.save();
        return res.status(200).json({
            message: 'Cost Successfully created!',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const list = async (req, res) => {
    try {
        let costs = await Cost.find();
        res.json(costs);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};


export default {
    create,list
};
