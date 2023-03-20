import express from 'express';
import dashboardCtrl from '../controllers/dashboard.controller';


const router = express.Router();

router.route('/ocpp/dashboard').get(dashboardCtrl.getDashboardStats)



export default router;
