import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    let updatedData = req.body;

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedData = { ...req.body, password: hashedPassword };
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "OK." });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default {
  getAllUsers,
  updateUser,
  getUserById,
  deleteUser,
};
