import express from "express";
import chargerPoint from "../controllers/chargerPoint.controller";

const router = express.Router();


router
.route("/ocpp/chargerPoints/status")
.get(chargerPoint.status)

router
.route("/ocpp/chargerPoints/clients")
.get(chargerPoint.clients)

router
.route("/ocpp/chargerPoints/:charger_box_id")
.get(chargerPoint.read)
.put(chargerPoint.update)
.delete(chargerPoint.remove);

router
.route("/ocpp/chargerPoints/:id/:conector")
.post(chargerPoint.remoteStart)

router
  .route("/ocpp/chargerPoints")
  .get(chargerPoint.list)
  .post(chargerPoint.create);
  
router.param("charger_box_id", chargerPoint.chargerPointByID);

export default router;
