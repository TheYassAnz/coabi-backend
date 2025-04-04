import express from "express";
import taskCtrl from "../controllers/task";

const router = express.Router();

router.get("/", authMiddleware, taskCtrl.getAllTasks);
router.get("/:id", authMiddleware, taskCtrl.getTaskById);
router.post("/", authMiddleware, taskCtrl.createTask);
router.put("/:id", authMiddleware, taskCtrl.updateTask);
router.delete("/:id", authMiddleware, taskCtrl.deleteTask);

export default router;
