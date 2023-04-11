import express from 'express';
import companyController from '../controllers/company.controller';

const router = express.Router();

router
  .route('/ocpp/company')
  .get(companyController.list)
  .post(companyController.create);

  router
  .route('/ocpp/company/:id')
  //.put(companyController.update)
  .delete(companyController.remove);

export default router;