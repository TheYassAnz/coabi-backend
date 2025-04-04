import express from "express";
import fileCtrl from "../controllers/file";
import { upload } from "../controllers/file";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), fileCtrl.uploadFile);
router.get("/:id", authMiddleware, fileCtrl.getFileById);
router.delete("/:id", authMiddleware, fileCtrl.deleteFile);

export default router;
