import { Request, Response } from "express";
import FileService from "../services/file-service";

const fileService = new FileService();
export const upload = fileService.upload;

const uploadFile = async (req: Request, res: Response): Promise<void> => {
  return fileService.uploadFile(req, res);
};

const getFileById = async (req: Request, res: Response): Promise<void> => {
  return fileService.getFileById(req, res);
};

const deleteFileById = async (req: Request, res: Response): Promise<void> => {
  return fileService.deleteFileById(req, res);
};

export default {
  uploadFile,
  getFileById,
  deleteFileById,
};
