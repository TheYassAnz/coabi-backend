import { Request, Response } from "express";
import { FileModel, FileTypes } from "../models/file";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

class FileService {
  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });

  private fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF and PDF files are allowed.",
        ),
      );
    }
  };

  public upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });

  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded.", code: "NO_FILE" });
        return;
      }

      const { description, userId, accommodationId } = req.body;

      const fileType =
        req.file.mimetype === "application/pdf"
          ? FileTypes.PDF
          : FileTypes.IMAGE;

      const newFile = new FileModel({
        _id: req.file.filename,
        name: req.file.originalname,
        description,
        type: fileType,
        size: req.file.size,
        userId,
        accommodationId,
      });

      await newFile.save();
      res.status(201).json(newFile);
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async getFileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const file = await FileModel.findById(id);

      if (!file) {
        res.status(404).json({ message: "Not found", code: "FILE_NOT_FOUND" });
        return;
      }

      const filePath = path.join(__dirname, "../../uploads", file._id);
      res.sendFile(filePath);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async deleteFileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const file = await FileModel.findById(id);

      if (!file) {
        res.status(404).json({ message: "Not found", code: "FILE_NOT_FOUND" });
        return;
      }

      const filePath = path.join(__dirname, "../../uploads", file._id);
      fs.unlinkSync(filePath);
      await file.deleteOne();

      res.sendStatus(204);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
}

export default FileService;
