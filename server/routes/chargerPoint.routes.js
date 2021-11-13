import express from "express";
import chargePoint from "../controllers/chargerPoint.controller";

const router = express.Router();

router
  .route("/ocpp/chargerPoints")
  .get(chargePoint.list)
  .post(chargePoint.create);

router
  .route("/ocpp/chargerPoints/:charger_box_id")
  .get( chargePoint.read)
  .put(chargePoint.update)
  .delete(chargePoint.remove);

router.param("charger_box_id", chargePoint.chargerPointByID);

export default router;
