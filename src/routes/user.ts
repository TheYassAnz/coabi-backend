import express from "express";
import userCtrl from "../controllers/user";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, userCtrl.getAllUsers);
router.get("/filter", authMiddleware, userCtrl.filterUsers);
router.get("/:id", authMiddleware, userCtrl.getUserById);
router.patch("/:id", authMiddleware, userCtrl.updateUserById);
router.patch("/password/:id", authMiddleware, userCtrl.updateUserPasswordById);
router.delete("/:id", authMiddleware, userCtrl.deleteUserById);

export default router;
