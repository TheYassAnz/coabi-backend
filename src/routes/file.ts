import express from "express";
import fileCtrl from "../controllers/file";
import { upload } from "../controllers/file";

const router = express.Router();

router.post("/", upload.single("file"), fileCtrl.uploadFile);
router.get("/:id", fileCtrl.getFileById);
router.delete("/:id", fileCtrl.deleteFile);

export default router;
