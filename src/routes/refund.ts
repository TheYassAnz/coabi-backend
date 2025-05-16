import express from "express";
import refundCtrl from "../controllers/refund";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import {
  validateAccommodationReference,
  validateUserReference,
  validateRoommatesReference,
} from "../middleware/validate-references";

const router = express.Router();

router.get("/", authMiddleware, refundCtrl.getAllRefunds);
router.get("/filter", authMiddleware, refundCtrl.filterRefunds);
router.post(
  "/",
  authMiddleware,
  validateAccommodationReference,
  validateUserReference,
  validateRoommatesReference,
  refundCtrl.createRefunds,
);
router.get("/:id", authMiddleware, validateObjectId, refundCtrl.getRefundById);
router.patch(
  "/:id",
  authMiddleware,
  validateObjectId,
  refundCtrl.updateRefundById,
);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  refundCtrl.deleteRefundById,
);

export default router;
