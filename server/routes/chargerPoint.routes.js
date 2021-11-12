import express from "express";
import chargePoint from "../controllers/chargerPoint.controller";

const router = express.Router();

router
  .route("/ocpp/chargerPoints")
  .get(chargePoint.list)
  .post(chargePoint.create);

router
  .route("/ocpp/chargerPoints/:chargerPointId")
  .get( chargePoint.read)
  .put(chargePoint.update)
  .delete(chargePoint.remove);

router.param("chargerPointId", chargePoint.chargerPointByID);

export default router;
