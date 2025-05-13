import { Request, Response } from "express";
import AccommodationService from "../services/accommodation-service";

const accommodationService = new AccommodationService();

const getAllAccommodations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return accommodationService.getAllAccommodations(req, res);
};

const createAccommodation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return accommodationService.createAccommodation(req, res);
};

const getAccommodationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return accommodationService.getAccommodationById(req, res);
};

const updateAccommodationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return accommodationService.updateAccommodationById(req, res);
};

const deleteAccommodationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return accommodationService.deleteAccommodationById(req, res);
};

export default {
  getAllAccommodations,
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById,
};
