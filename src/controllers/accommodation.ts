const Accommodation = require("../models/accommodation");

import { error } from "console";
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

const createAccommodation = (req: Request, res: Response) => {
  const { name, code, location, postalCode, country } = req.body;

  if (!name || !code || !location || !postalCode || !country) {
    return res
      .status(400)
      .json({ message: "Bad request", error: "All fields are required" });
  }

  const newAccommodation = new Accommodation({
    name,
    code,
    location,
    postalCode,
    country,
  });

  newAccommodation
    .save()
    .then(() => {
      res.status(201).json({
        message: "OK",
        data: newAccommodation,
      });
    })
    .catch((error: any) => {
      res.status(500).json({ message: "Bad request", error });
    });
};

const getOneAccommodation = (req: Request, res: Response) => {};
