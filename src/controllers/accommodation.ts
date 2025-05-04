import Accommodation from "../models/accommodation";
import User from "../models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { generateRandomCode } from "../utils/utils";
import {
  hasAccessToAccommodation,
  canModifyAccommodation,
} from "../utils/auth/accommodation";
import { testEnv } from "../utils/env";

const getAllAccommodations = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const role = req.role;
    if (!testEnv && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const accommodations = await Accommodation.find();
    return res.status(200).json(accommodations);
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
    const userId = req.userId;

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

    if (!testEnv) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.accommodationId = newAccommodation._id;
      user.role = "moderator";
      await user.save();
    }

    return res.status(201).json(newAccommodation);
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
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!hasAccessToAccommodation(role, userAccommodationId, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(accommodation);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const updateData = req.body;
    const { id } = req.params;
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!canModifyAccommodation(role, userAccommodationId, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(accommodation);
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
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }

    if (!canModifyAccommodation(role, userAccommodationId, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await accommodation.deleteOne();

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
