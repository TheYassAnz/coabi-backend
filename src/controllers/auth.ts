import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      age,
      description,
      email,
      phone_number,
      profile_picture_id,
      accommodation_id,
    } = req.body;

    const existUsername = await User.findOne({ username });

    if (existUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      age,
      description,
      email,
      phone_number,
      profile_picture_id,
      accommodation_id,
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
