import express from "express";
import taskCtrl from "../controllers/task";

const router = express.Router();

router.get("/", taskCtrl.getAllTasks);
router.get("/filter", taskCtrl.filterTasks);
router.post("/", taskCtrl.createTask);
router.get("/:id", taskCtrl.getTaskById);
router.patch("/:id", taskCtrl.updateTaskById);
router.delete("/:id", taskCtrl.deleteTaskById);

export default router;
