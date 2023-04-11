import Company from "../models/company.model";


const create = async (req, res) => {

    const company = new Company(req.body);
    try {
        await company.save();
        return res.status(200).json({
            message: 'Company Successfully created!',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const list = async (req, res) => {
    try {
        let Companies = await Company.find();
        res.json(Companies);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const remove = async (req, res) => {
    try {
        const deletedObject = await Company.findByIdAndRemove(req.params.id);
        res.status(200).json(deletedObject);
      } catch (error) {
        console.error(error);
      }
};


export default {
    create,list,remove
};
