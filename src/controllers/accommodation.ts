import Accommodation from "../models/accommodation";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { generateRandomCode } from "../utils/utils";

const getAllAccommodations = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const accommodations = await Accommodation.find();
    return res.status(200).json({ message: "Ok", data: accommodations });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createAccommodation = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, location, postalCode, country } = req.body;

    let code: string;
    let existCode: boolean;

    do {
      code = generateRandomCode();
      existCode = !!(await Accommodation.findOne({ code }));
    } while (existCode);

    const newAccommodation = new Accommodation({
      name,
      code,
      location,
      postalCode,
      country,
    });

    await newAccommodation.save();

    return res.status(201).json({ message: "Ok", data: newAccommodation });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Ok", data: accommodation });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, location, postalCode, country } = req.body;
    const accommodationId = req.params.id;

    const accommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      {
        name,
        location,
        postalCode,
        country,
      },
      { new: true, runValidators: true },
    );
    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Ok", data: accommodation });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const accommodation = await Accommodation.findByIdAndDelete(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllAccommodations,
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById,
};
