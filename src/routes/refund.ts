import express from "express";
import refundCtrl from "../controllers/refund";

const router = express.Router();

router.get("/", refundCtrl.getAllRefunds);
router.post("/", refundCtrl.createRefund);
router.get("/:id", refundCtrl.getRefundById);
router.put("/:id", refundCtrl.updateRefund);
router.delete("/:id", refundCtrl.deleteRefund);

export default router;
