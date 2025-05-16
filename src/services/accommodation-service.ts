import Accommodation from "../models/accommodation";
import User from "../models/user";
import { Request, Response } from "express";
import { generateRandomCode } from "../utils/utils";
import { testEnv } from "../utils/env";
import { AccommodationBusiness } from "./business/accommodation-business";

class AccommodationService {
  async getAllAccommodations(req: Request, res: Response): Promise<void> {
    try {
      const role = req.role;
      if (!testEnv && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }
      const accommodations = await Accommodation.find().select("-code");
      res.status(200).json(accommodations);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR ",
      });
      return;
    }
  }

  async createAccommodation(req: Request, res: Response): Promise<void> {
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
          res
            .status(404)
            .json({ message: "User not found", code: "USER_NOT_FOUND" });
          return;
        }
        user.accommodationId = newAccommodation._id;
        user.role = "moderator";
        await user.save();
      }

      const { code: accommodationCode, ...accommodationWithoutCode } =
        newAccommodation.toObject();

      res.status(201).json(accommodationWithoutCode);
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async getAccommodationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = req.role;
      const userAccommodationId = req.accommodationId;

      if (
        !AccommodationBusiness.hasAccess(testEnv, role, userAccommodationId, id)
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const accommodation = await Accommodation.findById(id);

      if (!accommodation) {
        res
          .status(404)
          .json({ message: "Not found", code: "ACCOMMODATION_NOT_FOUND" });
        return;
      }

      const { code: accommodationCode, ...accommodationWithoutCode } =
        accommodation.toObject();

      res.status(200).json(accommodationWithoutCode);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async updateAccommodationById(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const { id } = req.params;
      const role = req.role;
      const userAccommodationId = req.accommodationId;

      if (
        !AccommodationBusiness.canModify(testEnv, role, userAccommodationId, id)
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const accommodation = await Accommodation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!accommodation) {
        res
          .status(404)
          .json({ message: "Not found", code: "ACCOMMODATION_NOT_FOUND" });
        return;
      }

      const { code: accommodationCode, ...accommodationWithoutCode } =
        accommodation.toObject();

      res.status(200).json(accommodationWithoutCode);
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async deleteAccommodationById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const role = req.role;
      const userAccommodationId = req.accommodationId;

      const accommodation = await Accommodation.findById(id);

      if (!accommodation) {
        res
          .status(404)
          .json({ message: "Not found", code: "ACCOMMODATION_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.canModify(testEnv, role, userAccommodationId, id)
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await accommodation.deleteOne();

      res.sendStatus(204);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
}

export default AccommodationService;
