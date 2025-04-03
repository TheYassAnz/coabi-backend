import Accommodation from "../models/accommodation";
import { Request, Response } from "express";

const getAllAccommodations = (req: Request, res: Response): Promise<any> => {
  return Accommodation.find()
    .then((accommodations: any[]) => {
      return res.status(200).json({
        message: "OK",
        data: accommodations,
      });
    })
    .catch((error: any) => {
      return res
        .status(500)
        .json({ message: "Not found", error: error.message });
    });
};

const createAccommodation = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, code, location, postalCode, country } = req.body;

    if (!name || !code || !location || !postalCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Bad request", error });
  }
};

const getAccommodationById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  Accommodation.findById(req.params.id)
    .then((accommodation: any) => {
      if (!accommodation) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json({ message: "OK", data: accommodation });
    })
    .catch((error: any) => {
      return res.status(500).json({ message: "Bad request", error });
    });
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
      { new: true },
    );
    if (!accommodation) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "OK", data: accommodation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bad request", error });
  }
};

export default {
  updateAccommodationById,
  getAccommodationById,
  getAllAccommodations,
  createAccommodation,
};
