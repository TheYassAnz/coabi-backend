import express from "express";
import userCtrl from "../controllers/user";

const router = express.Router();

router.get("/", authMiddleware, userCtrl.getAllUsers);
router.get("/:id", authMiddleware, userCtrl.getUserById);
router.put("/:id", authMiddleware, userCtrl.updateUser);
router.delete("/:id", authMiddleware, userCtrl.deleteUser);

export default router;
