import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Bad request", code: "BAD_REQUEST" });
  }
  next();
};
