import express from "express";
import userCtrl from "../controllers/user";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import { validateAccommodationReference } from "../middleware/validate-references";

const router = express.Router();

router.get("/", authMiddleware, userCtrl.getAllUsers);
router.get("/filter", authMiddleware, userCtrl.filterUsers);
router.get("/:id", authMiddleware, validateObjectId, userCtrl.getUserById);
router.patch(
  "/:id/join",
  authMiddleware,
  validateObjectId,
  validateAccommodationReference,
  userCtrl.joinAccommodationByCode,
);
router.patch(
  "/:id",
  authMiddleware,
  validateObjectId,
  validateAccommodationReference,
  userCtrl.updateUserById,
);
router.patch(
  "/:id/password",
  authMiddleware,
  validateObjectId,
  userCtrl.updateUserPasswordById,
);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  userCtrl.deleteUserById,
);

export default router;
