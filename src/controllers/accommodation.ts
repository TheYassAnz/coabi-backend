import Accommodation from "../models/accommodation";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllAccommodations = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const accommodations = await Accommodation.find();
    return res.status(200).json({ accommodations });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

const createAccommodation = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, code, location, postalCode, country } = req.body;

    if (!name || !code || !location || !postalCode || !country) {
      return res.status(400).json({ error: "Bad request" });
    }

    const newAccommodation = new Accommodation({
      name,
      code,
      location,
      postalCode,
      country,
    });

    await newAccommodation.save();

    return res.status(201).json({ accommodation: newAccommodation });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(accommodation);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, code, location, postalCode, country } = req.body;
    const accommodationId = req.params.id;

    const accommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      {
        name,
        code,
        location,
        postalCode,
        country,
      },
      { new: true, runValidators: true },
    );
    if (!accommodation) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json(accommodation);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const accommodationId = req.params.id;
    const accommodation =
      await Accommodation.findByIdAndDelete(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ message: "OK." });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  deleteAccommodationById,
  updateAccommodationById,
  getAccommodationById,
  getAllAccommodations,
  createAccommodation,
};
