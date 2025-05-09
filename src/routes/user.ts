import express from "express";
import userCtrl from "../controllers/user";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, userCtrl.getAllUsers);
router.get("/filter", authMiddleware, userCtrl.filterUsers);
router.get("/:id", authMiddleware, userCtrl.getUserById);
router.patch("/:id/join", authMiddleware, userCtrl.joinAccommodationByCode);
router.patch("/:id", authMiddleware, userCtrl.updateUserById);
router.patch("/:id/password", authMiddleware, userCtrl.updateUserPasswordById);
router.delete("/:id", authMiddleware, userCtrl.deleteUserById);

export default router;
