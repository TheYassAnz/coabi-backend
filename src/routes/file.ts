import express from "express";
import fileCtrl from "../controllers/file";
import { upload } from "../controllers/file";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import { validateUserReference } from "../middleware/validate-references";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  validateUserReference,
  fileCtrl.uploadFile,
);
router.get("/:id", authMiddleware, validateObjectId, fileCtrl.getFileById);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  fileCtrl.deleteFileById,
);

export default router;
