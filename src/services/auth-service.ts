import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validPasswordLength } from "../utils/utils";
import {
  generateTokens,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from "../utils/auth/jwt";
import { sendWelcomeEmail } from "../utils/mailer";

class AuthService {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = req.body;

      if (!validPasswordLength(password)) {
        res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
          code: "PASSWORD_LENGTH",
        });
        return;
      }

      const existingUsername = await User.findOne({ username });

      if (existingUsername) {
        res
          .status(409)
          .json({ message: "Username already taken", code: "USERNAME_TAKEN" });
        return;
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res
          .status(409)
          .json({ message: "Email already taken", code: "EMAIL_TAKEN" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      });

      await newUser.save();

      // Send welcome email
      try {
        await sendWelcomeEmail(email, username);
        console.log("Welcome email sent successfully to:", email);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }

      const { password: userPassword, ...userWithoutPassword } =
        newUser.toObject();

      res.status(201).json(userWithoutPassword);
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

  async login(req: Request, res: Response): Promise<void> {
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
        res.status(401).json({
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
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          message: "No refresh token provided",
          code: "NO_REFRESH_TOKEN",
        });
        return;
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (err) {
        res.status(401).json({
          message: "Invalid refresh token",
          code: "INVALID_REFRESH_TOKEN",
        });
        return;
      }

      const userId = typeof decoded === "string" ? decoded : decoded.id;

      if (!userId) {
        res.status(403).json({
          message: "Invalid token payload",
          code: "INVALID_TOKEN_PAYLOAD",
        });
        return;
      }

      const tokens = generateTokens({ id: userId });

      setRefreshTokenCookie(res, tokens.refreshToken);
      res.status(200).json({ accessToken: tokens.accessToken });
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
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

export default AuthService;
