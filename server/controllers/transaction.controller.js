import Transaction from '../models/transaction.model';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => {
  const transaction = new Transaction(req.body);
  try {
    await transaction.save();
    return res.status(200).json({
      message: 'Transaction Successfully created!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
    try {
        let transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
  };

  const read = async (req, res) => {    // console.log(req)
    let transactions = await Transaction.find({chargerPointId: req.params.idCP}).exec();
    console.log(transactions)
    res.json(transactions)

};



export default { create, list, read };
