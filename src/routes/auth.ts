import express from "express";
import registerCtrl from "../controllers/register";
import loginCtrl from "../controllers/login";

const router = express.Router();

router.post("/register", registerCtrl.register);
router.post("/login", loginCtrl.login);

export default router;
