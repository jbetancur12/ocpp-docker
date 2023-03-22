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

const list =  (req, res) => {
    try {
      Transaction.find().exec((err, transactions)=> res.status(200).json({ transactions }));
      
    } catch (error) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
  };

// const list = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;
        
//         const total = await Transaction.countDocuments();
//         const transactions = await Transaction
//                                   .find()
//                                   .populate('users')
//                                   .skip(startIndex)
//                                   .limit(limit)
//                                   .exec();

//         res.json({
//             total: total,
//             page: page,
//             limit: limit,
//             transactions: transactions
//         });
//     } catch (err) {
//         return res.status(400).json({
//             error: errorHandler.getErrorMessage(err),
//         });
//     }
// };

  const read = async (req, res) => {    // console.log(req)
    let transactions = await Transaction.find({chargerPointId: req.params.idCP}).exec();
    console.log(transactions)
    res.json(transactions)

};



export default { create, list, read };
