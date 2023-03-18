import express from 'express';
import costController from '../controllers/cost.controller';

const router = express.Router();

router
  .route('/ocpp/cost')
  .get(costController.list)
  .post(costController.create);

export default router;