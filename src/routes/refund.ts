import express from "express";
import refundCtrl from "../controllers/refund";

const router = express.Router();

router.get("/", refundCtrl.getAllRefunds);
router.get("/filter", refundCtrl.filterRefunds);
router.post("/", refundCtrl.createRefunds);
router.get("/:id", refundCtrl.getRefundById);
router.patch("/:id", refundCtrl.updateRefundById);
router.delete("/:id", refundCtrl.deleteRefundById);

export default router;
