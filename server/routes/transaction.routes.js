import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import transactionCtrl from "../controllers/transaction.controller";

const router = express.Router();

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, transactionCtrl.create);

router.param("userId", userCtrl.userByID);

export default router;
