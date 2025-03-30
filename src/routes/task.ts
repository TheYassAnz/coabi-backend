import express from "express";
import taskCtrl from "../controllers/task";

const router = express.Router();

router.get("/", taskCtrl.getAllTasks);
router.get("/:id", taskCtrl.getOneTask);
router.post("/", taskCtrl.createTask);
router.put("/:id", taskCtrl.updateTask);
router.delete("/:id", taskCtrl.deleteTask);

export default router;
