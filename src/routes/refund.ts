import express from "express";
import refundCtrl from "../controllers/refund";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, refundCtrl.getAllRefunds);
router.get("/filter", authMiddleware, refundCtrl.filterRefunds);
router.post("/", authMiddleware, refundCtrl.createRefunds);
router.get("/:id", authMiddleware, refundCtrl.getRefundById);
router.patch("/:id", authMiddleware, refundCtrl.updateRefundById);
router.delete("/:id", authMiddleware, refundCtrl.deleteRefundById);

export default router;
