import express from 'express';
import authCtrl from '../controllers/auth.controller';
import userCtrl from '../controllers/user.controller';
import chargerPoint from '../controllers/chargerPoint.controller';

const router = express.Router();

router.route('/ocpp/chargerPoints/status').get(chargerPoint.status);

router.route('/ocpp/chargerPoints/clients').get(chargerPoint.clients);

router
  .route('/ocpp/chargerPoints/:station')
  .get(chargerPoint.read)
  .put(chargerPoint.update)
  .delete(chargerPoint.remove);

router
  .route('/ocpp/chargerPoints/addConnector/:station')
  .put(chargerPoint.addConnector)


router
  .route('/ocpp/chargerPoints/start/:userId')
  .post(chargerPoint.remoteStart);

router
  .route('/ocpp/chargerPoints/unlock/')
  .post(chargerPoint.unlock);

  router
  .route('/ocpp/chargerPoints/stop/')
  .post(chargerPoint.stop);
  
  
router
  .route('/ocpp/chargerPoints/reset')
  .post(chargerPoint.reset)

router
  .route('/ocpp/chargerPoints/get_conf')
  .post(chargerPoint.getConf)

  router
  .route('/ocpp/chargerPoints/set_conf')
  .post(chargerPoint.setConfig)

  router
  .route('/ocpp/chargerPoints/clear_cache')
  .post(chargerPoint.clearCache)

  router
  .route('/ocpp/chargerPoints/trigger-message')
  .post(chargerPoint.triggerMessage)

router
  .route('/ocpp/chargerPoints')
  .get(chargerPoint.list)
  .post(chargerPoint.create);

router.param('station', chargerPoint.chargerPointByID);
router.param('userId', userCtrl.userByID);

export default router;
