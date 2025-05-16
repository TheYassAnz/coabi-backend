import express from "express";
import taskCtrl from "../controllers/task";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import {
  validateAccommodationReference,
  validateUserReference,
} from "../middleware/validate-references";

const router = express.Router();

router.get("/", authMiddleware, taskCtrl.getAllTasks);
router.get("/filter", authMiddleware, taskCtrl.filterTasks);
router.post(
  "/",
  authMiddleware,
  validateAccommodationReference,
  validateUserReference,
  taskCtrl.createTask,
);
router.get("/:id", authMiddleware, validateObjectId, taskCtrl.getTaskById);
router.patch("/:id", authMiddleware, validateObjectId, taskCtrl.updateTaskById);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  taskCtrl.deleteTaskById,
);

export default router;
