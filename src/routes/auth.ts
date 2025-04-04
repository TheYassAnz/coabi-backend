import express from "express";
import authCtrl from "../controllers/auth";

const router = express.Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);

export default router;
