import express from "express";
import ruleCtrl from "../controllers/rule";

const router = express.Router();

router.get("/", ruleCtrl.getAllRules);
router.get("/:id", ruleCtrl.getRuleById);
router.post("/", ruleCtrl.createRule);
router.put("/:id", ruleCtrl.updateRule);
router.delete("/:id", ruleCtrl.deleteRule);

export default router;
