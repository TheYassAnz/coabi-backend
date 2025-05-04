import User from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { validPasswordLength } from "../utils/utils";
import { testEnv } from "../utils/env";
import { Role } from "../types/role";

interface QueryParamsUsers {
  $or?: {
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    username?: { $regex: string; $options: string };
  }[];
  role?: Role;
  accommodationId?: mongoose.Types.ObjectId;
}

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const role = req.role;
    if (!testEnv && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const role = req.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!testEnv && role !== "admin" && userId !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const role = req.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!testEnv && role !== "admin" && userId !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updatedData = req.body;
    const { username, email } = updatedData;

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== id) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const updatePasswordById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const role = req.role;
    const { currentPassword, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!testEnv && role !== "admin" && userId !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword) {
      if (!validPasswordLength(newPassword)) {
        return res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
    } else {
      return res.status(400).json({ message: "New password is required" });
    }

    const { password: userPassword, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const role = req.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!testEnv && role !== "admin" && userId !== id) {
      return res.status(403).json({ message: "Forbidden" });
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
    const role = req.role;
    const userAccommodationId = req.accommodationId;
    const possibleRoles = ["user", "moderator", "admin"];

    const params: QueryParamsUsers = {};

    if (name) {
      const regex = { $regex: name as string, $options: "i" };
      params.$or = [
        { firstName: regex },
        { lastName: regex },
        { username: regex },
      ];
    }

    if (role) {
      params.role = possibleRoles.includes(role) ? role : "user";
    }

    if (!testEnv && role !== "admin" && userAccommodationId) {
      params.accommodationId = new mongoose.Types.ObjectId(userAccommodationId);
    }

    const users = await User.find(params).select("-password");
    return res.status(200).json(users);
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
  updatePasswordById,
  deleteUserById,
  filterUsers,
};
