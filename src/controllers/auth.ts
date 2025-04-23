import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validPasswordLength } from "../utils/utils";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      age,
      description,
      email,
      phoneNumber,
      profilePictureId,
      accommodationId,
    } = req.body;

    const existUsername = await User.findOne({ username });

    if (existUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (!validPasswordLength(password)) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      age,
      description,
      email,
      phoneNumber,
      profilePictureId,
      accommodationId,
    });

    await newUser.save();

    res.status(201).json({ message: "Ok", data: newUser });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Bad request" });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Client error." });
      return;
    }

    const secretKey = process.env.SECRET_KEY || "zDZEKIOazirnaz";
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ message: "OK", data: token });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  register,
  login,
};
