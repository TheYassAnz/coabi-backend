import { Request, Response } from "express";
import { FileModel, FileTypes } from "../models/file";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

const storage = multer.diskStorage({
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

const fileFilter = (
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

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { description, user_id } = req.body;

    const fileType =
      req.file.mimetype === "application/pdf" ? FileTypes.PDF : FileTypes.IMAGE;

    const newFile = new FileModel({
      _id: req.file.filename,
      name: req.file.originalname,
      description,
      type: fileType,
      size: req.file.size,
      user_id,
    });

    await newFile.save();
    res.status(201).json({ message: "Ok", data: newFile });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getFileById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({ message: "Not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", file._id);
    res.sendFile(filePath);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const deleteFileById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({ message: "Not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", file._id);
    fs.unlinkSync(filePath);
    await file.deleteOne();

    return res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default {
  uploadFile,
  getFileById,
  deleteFileById,
};
