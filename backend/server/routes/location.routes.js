import express from 'express';
import locationController from '../controllers/location.controller';

const router = express.Router();

router
  .route('/ocpp/locations')
  .get(locationController.list)
  .post(locationController.create);

export default router;