import express from "express";
import ruleCtrl from "../controllers/rule";

const router = express.Router();

router.get("/", ruleCtrl.getAllRules);
router.post("/", ruleCtrl.createRule);
router.get("/:id", ruleCtrl.getRuleById);
router.put("/:id", ruleCtrl.updateRuleById);
router.delete("/:id", ruleCtrl.deleteRuleById);

export default router;
