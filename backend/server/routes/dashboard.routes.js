import express from 'express';
import dashboardCtrl from '../controllers/dashboard.controller';


const router = express.Router();

router.route('/ocpp/dashboard').get(dashboardCtrl.getDashboardStats)
router.route('/ocpp/dashboard/graphs').get(dashboardCtrl.getDashboardGrap)
router.route('/ocpp/dashboard/charger-points-graphs').get(dashboardCtrl.getDashboardGraphs)
router.route('/ocpp/dashboard/charger-points').get(dashboardCtrl.getCPStats)



export default router;
