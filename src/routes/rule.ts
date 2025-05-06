import express from "express";
import ruleCtrl from "../controllers/rule";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, ruleCtrl.getAllRules);
router.post("/", authMiddleware, ruleCtrl.createRule);
router.get("/:id", authMiddleware, ruleCtrl.getRuleById);
router.patch("/:id", authMiddleware, ruleCtrl.updateRuleById);
router.delete("/:id", authMiddleware, ruleCtrl.deleteRuleById);

export default router;
