import User from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { validPasswordLength } from "../utils/utils";

interface QueryParamsUsers {
  $or?: {
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    username?: { $regex: string; $options: string };
  }[];
}

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    return res.json({ message: "Ok", data: users });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Ok", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    let updatedData = req.body;
    const { password } = updatedData;

    if (password) {
      if (!validPasswordLength(password)) {
        return res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData = { ...updatedData, password: hashedPassword };
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Ok", data: user });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    await User.findByIdAndDelete(id);

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const filterUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.query;

    const params: QueryParamsUsers = {};

    if (name) {
      const regex = { $regex: name as string, $options: "i" };
      params.$or = [
        { firstName: regex },
        { lastName: regex },
        { username: regex },
      ];
    }

    const users = await User.find(params);

    return res.status(200).json({ message: "Ok", data: users });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  filterUsers,
};
