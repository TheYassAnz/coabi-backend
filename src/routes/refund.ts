import express from "express";
import refundCtrl from "../controllers/refund";

const router = express.Router();

router.get("/", authMiddleware, refundCtrl.getAllRefunds);
router.post("/", authMiddleware, refundCtrl.createRefund);
router.get("/:id", authMiddleware, refundCtrl.getRefundById);
router.put("/:id", authMiddleware, refundCtrl.updateRefund);
router.delete("/:id", authMiddleware, refundCtrl.deleteRefund);

export default router;
