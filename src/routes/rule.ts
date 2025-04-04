import express from "express";
import ruleCtrl from "../controllers/rule";

const router = express.Router();

router.get("/", authMiddleware, ruleCtrl.getAllRules);
router.get("/:id", authMiddleware, ruleCtrl.getRuleById);
router.post("/", authMiddleware, ruleCtrl.createRule);
router.put("/:id", authMiddleware, ruleCtrl.updateRule);
router.delete("/:id", authMiddleware, ruleCtrl.deleteRule);

export default router;
