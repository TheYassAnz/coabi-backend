import Accommodation from "../models/accommodation";
import { Request, Response } from "express";

const getAllAccommodations = (req: Request, res: Response) => {
  Accommodation.find()
    .then((accommodations: any) => {
      res.status(200).json({
        message: "OK",
        data: accommodations,
      });
    })
    .catch((error: any) => {
      res.status(500).json({ message: "Not found", error: error.message });
    });
};

const createAccommodation = async (req: Request, res: Response) => {
  try {
    const { name, code, location, postalCode, country } = req.body;

    if (!name || !code || !location || !postalCode || !country) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newAccommodation = new Accommodation({
      name,
      code,
      location,
      postalCode,
      country,
    });

    await newAccommodation.save();

    res.status(201).json({ accommodation: newAccommodation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Bad request", error });
  }
};

export default {
  getAllAccommodations,
  createAccommodation,
};
