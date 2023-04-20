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

const update = async (req, res) => {
    try {
      const costId = req.params.id;
      const updatedCostPayload = req.body;
    
      const updatedCost = await Cost.findOneAndUpdate(
        { _id: costId },
        { $set: updatedCostPayload},
        { new: true }
      );
    
    //   console.log("🚀 ~ file: chargerPoint.controller.js:82 ~ update ~ req:", updatedCp)
    
    //   const CPlocation = updatedCp.location;
    //   await Location.findByIdAndUpdate(
    //     CPlocation,
    //     { $push: { chargerPoints: updatedCp._id } },
    //     { new: true }
    //   );
        
      res.json(updatedCost);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  };

const remove = async (req, res) => {
    try {
        const deletedObject = await Cost.findByIdAndRemove(req.params.id);
        res.status(200).json(deletedObject);
      } catch (error) {
        console.error(error);
      }
};


export default {
    create,list,remove,update
};
