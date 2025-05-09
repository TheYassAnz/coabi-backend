import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validPasswordLength } from "../utils/utils";
import {
  generateTokens,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from "../utils/auth/jwt";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, email } = req.body;

    if (!validPasswordLength(password)) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 characters.",
        code: "PASSWORD_LENGTH",
      });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Username already taken", code: "USERNAME_TAKEN" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email already taken", code: "EMAIL_TAKEN" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    const { password: userPassword, ...userWithoutPassword } =
      newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }
    res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res
        .status(404)
        .json({ message: "User does not exist", code: "USER_NOT_FOUND" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res
        .status(401)
        .json({
          message: "Incorrect credentials",
          code: "INCORRECT_CREDENTIALS",
        });
      return;
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
    });
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ accessToken: accessToken });
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({
          message: "No refresh token provided",
          code: "NO_REFRESH_TOKEN",
        });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res
        .status(401)
        .json({
          message: "Invalid refresh token",
          code: "INVALID_REFRESH_TOKEN",
        });
    }

    const userId = typeof decoded === "string" ? decoded : decoded.id;

    if (!userId) {
      return res
        .status(403)
        .json({
          message: "Invalid token payload",
          code: "INVALID_TOKEN_PAYLOAD",
        });
    }

    const tokens = generateTokens({ id: userId });

    setRefreshTokenCookie(res, tokens.refreshToken);
    return res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("refreshToken");
    return res.sendStatus(204);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

export default {
  register,
  login,
  refresh,
  logout,
};
