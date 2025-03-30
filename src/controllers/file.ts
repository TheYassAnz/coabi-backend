import { Request, Response } from "express";
import { FileModel, FileTypes } from "../models/file";
import multer from "multer";
import path from "path";
import fs from "fs";

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
      return res
        .status(400)
        .json({ error: "Aucun fichier n'a été téléchargé." });
    }

    const { description, user_id } = req.body;

    if (!description || !user_id) {
      return res
        .status(400)
        .json({ error: "La description et l'ID utilisateur sont requis." });
    }

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
    res.status(201).json({ file: newFile });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors du téléchargement du fichier.",
    });
  }
};

const getFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({ message: "Fichier non trouvé." });
    }

    const filePath = path.join(__dirname, "../../uploads", file._id);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération du fichier.",
    });
  }
};

const deleteFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({ message: "Fichier non trouvé." });
    }

    const filePath = path.join(__dirname, "../../uploads", file._id);
    fs.unlinkSync(filePath);
    await file.deleteOne();

    res.status(200).json({ message: "Fichier supprimé avec succès." });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du fichier.",
    });
  }
};

export default {
  uploadFile,
  getFile,
  deleteFile,
};
