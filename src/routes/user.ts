import express from "express";
import userCtrl from "../controllers/user";

const router = express.Router();

router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getUserById);
router.put("/:id", userCtrl.updateUserById);
router.delete("/:id", userCtrl.deleteUserById);

export default router;
