import express from "express";
import refundCtrl from "../controllers/refund";

const router = express.Router();

router.get("/", refundCtrl.getAllRefunds);
router.post("/", refundCtrl.createRefund);
router.get("/:id", refundCtrl.getOneRefund);
router.delete("/:id", refundCtrl.deleteOneRefund);

export default router;
