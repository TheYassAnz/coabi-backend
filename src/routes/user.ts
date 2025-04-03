import express from "express";
import userCtrl from "../controllers/user";

const router = express.Router();

router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getUserById);
router.put("/:id", userCtrl.updateUser);
router.delete("/:id", userCtrl.deleteUser);

export default router;
