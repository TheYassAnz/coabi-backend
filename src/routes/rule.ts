import express from "express";
import ruleCtrl from "../controllers/rule";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import { validateAccommodationReference } from "../middleware/validate-references";

const router = express.Router();

router.get("/", authMiddleware, ruleCtrl.getAllRules);
router.post(
  "/",
  authMiddleware,
  validateAccommodationReference,
  ruleCtrl.createRule,
);
router.get("/:id", authMiddleware, validateObjectId, ruleCtrl.getRuleById);
router.patch("/:id", authMiddleware, validateObjectId, ruleCtrl.updateRuleById);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  ruleCtrl.deleteRuleById,
);

export default router;
