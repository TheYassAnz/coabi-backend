import { Request, Response } from "express";
import AccommodationService from "../services/AccommodationService";

const accommodationService = new AccommodationService();

const getAllAccommodations = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return accommodationService.getAllAccommodations(req, res);
};

const createAccommodation = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return accommodationService.createAccommodation(req, res);
};

const getAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return accommodationService.getAccommodationById(req, res);
};

const updateAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return accommodationService.updateAccommodationById(req, res);
};

const deleteAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return accommodationService.deleteAccommodationById(req, res);
};

export default {
  getAllAccommodations,
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById,
};
