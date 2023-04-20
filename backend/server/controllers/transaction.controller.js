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
    const { pageSize = 50, page = 0, search } = req.query;
  
    try {
      const transactions = await Transaction.find()
        .limit(Number(pageSize))
        .skip(Number(page) * Number(pageSize))
        .populate({ path: 'user', select: 'name email'})
        .populate({ path: 'chargerPointId', select: 'charger_box_id connectors'})
        .sort({ start_timestamp: -1 })
        .exec();
  
      const total = await Transaction.countDocuments();
  
      let filterTransactions = transactions;
  
      if (search && search.length > 0) {
        filterTransactions = transactions.filter((transaction) =>
          transaction.chargerPointId?.charger_box_id.includes(search) ||
          transaction.user?.email.includes(search)
        );
      }
  
      return res.status(200).json({ transactions: filterTransactions, total: total });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
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

  const read = async (req, res) => {   
    let transactions = await Transaction.find({chargerPointId: req.params.idCP}).exec();
    res.json(transactions)

};



export default { create, list, read };
