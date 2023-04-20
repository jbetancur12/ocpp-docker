import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import transactionCtrl from '../controllers/transaction.controller';

const router = express.Router();

router.route('/ocpp/transactions/:idCP').get(transactionCtrl.read)

router.route('/test').get((req,res)=> res.send("Holsdaaa"))



router
  .route('/ocpp/transactions/')
  .get(transactionCtrl.list);

router.param('userId', userCtrl.userByID);
// router.param('idCP', transactionCtrl.transactionByCPID);

export default router;
