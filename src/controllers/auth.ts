import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validPasswordLength } from "../utils/utils";
import {
  generateTokens,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from "../utils/auth/jwt";
import { csrfTokens, generateCsrfToken } from "../utils/auth/csrf";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, email } = req.body;

    if (!validPasswordLength(password)) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
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

const login = async (req: Request, res: Response): Promise<any> => {
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

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
    });
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ message: "OK", data: accessToken });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const csrf = async (req: Request, res: Response): Promise<any> => {
  try {
    const secret = await csrfTokens.secret();
    const token = await generateCsrfToken(secret);

    res.cookie("csrfSecret", secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ data: token });
  } catch (error) {
    return res.status(403).json({ error: "Invalid csrf token" });
  }
};

const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const userId = typeof decoded === "string" ? decoded : decoded.id;
    const tokens = generateTokens({
      id: userId,
    });

    setRefreshTokenCookie(res, tokens.refreshToken);
    return res.status(200).json({ data: tokens.accessToken });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("refreshToken");
    return res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  register,
  login,
  csrf,
  refresh,
  logout,
};
