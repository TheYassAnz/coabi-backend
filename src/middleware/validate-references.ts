import { NextFunction, Request, Response } from "express";
import Accommodation from "../models/accommodation";
import User from "../models/user";
import { testEnv } from "../utils/env";

export const validateAccommodationReference = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { accommodationId } = req.body;
  if (!testEnv && accommodationId) {
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({
        message: "Accommodation not found",
        code: "ACCOMMODATION_NOT_FOUND",
      });
    }
  }
  next();
};

export const validateUserReference = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId } = req.body;
  if (!testEnv && userId) {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }
  }
  next();
};

export const validateRoommatesReference = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { roommateIds } = req.body;
  if (!testEnv && roommateIds) {
    for (const roommateId of roommateIds) {
      const roommate = await User.findById(roommateId);
      if (!roommate) {
        return res.status(404).json({
          message: "Roommate not found",
          code: "ROOMMATE_NOT_FOUND",
        });
      }
    }
  }
  next();
};
