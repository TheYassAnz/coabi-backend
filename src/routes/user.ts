import express from "express";
import userCtrl from "../controllers/user";

const router = express.Router();

router.get("/", userCtrl.getAllUsers);
router.get("/filter", userCtrl.filterUsers);
router.get("/:id", userCtrl.getUserById);
router.patch("/:id", userCtrl.updateUserById);
router.delete("/:id", userCtrl.deleteUserById);

export default router;
