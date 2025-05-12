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

  async uploadFile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No file uploaded.", code: "NO_FILE" });
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
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async getFileById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const file = await FileModel.findById(id);

      if (!file) {
        return res
          .status(404)
          .json({ message: "Not found", code: "FILE_NOT_FOUND" });
      }

      const filePath = path.join(__dirname, "../../uploads", file._id);
      res.sendFile(filePath);
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async deleteFileById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const file = await FileModel.findById(id);

      if (!file) {
        return res
          .status(404)
          .json({ message: "Not found", code: "FILE_NOT_FOUND" });
      }

      const filePath = path.join(__dirname, "../../uploads", file._id);
      fs.unlinkSync(filePath);
      await file.deleteOne();

      return res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}

export default FileService;
