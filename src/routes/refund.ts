import express from "express";
import refundCtrl from "../controllers/refund";

const router = express.Router();

router.get("/", refundCtrl.getAllRefunds);
router.post("/", refundCtrl.createRefund);
router.get("/:id", refundCtrl.getRefundById);
router.put("/:id", refundCtrl.updateRefundById);
router.delete("/:id", refundCtrl.deleteRefundById);

export default router;
