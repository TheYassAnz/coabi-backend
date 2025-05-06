import express from "express";
import taskCtrl from "../controllers/task";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, taskCtrl.getAllTasks);
router.get("/filter", authMiddleware, taskCtrl.filterTasks);
router.post("/", authMiddleware, taskCtrl.createTask);
router.get("/:id", authMiddleware, taskCtrl.getTaskById);
router.patch("/:id", authMiddleware, taskCtrl.updateTaskById);
router.delete("/:id", authMiddleware, taskCtrl.deleteTaskById);

export default router;
