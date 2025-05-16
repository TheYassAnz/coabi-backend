import User from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { validPasswordLength } from "../utils/utils";
import { testEnv } from "../utils/env";
import { Role } from "../types/role";
import Accommodation from "../models/accommodation";
import { UserBusiness } from "./business/user-business";
import { AccommodationBusiness } from "./business/accommodation-business";

interface QueryParamsUsers {
  $or?: {
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    username?: { $regex: string; $options: string };
  }[];
  role?: Role;
  accommodationId?: mongoose.Types.ObjectId;
}

class UserService {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { role, accommodationId: userAccommodationId } = req;
      const { adminUI } = req.query;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      let params: any = {};

      if (role !== "admin" && adminUI !== "true") {
        if (userAccommodationId) {
          params.accommodationId = new mongoose.Types.ObjectId(
            userAccommodationId,
          );
        }
      }

      const users = await User.find(params).select("-password");
      res.json(users);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { accommodationId: userAccommodationId, role } = req;

      if (!testEnv && role !== "admin" && id !== req.userId) {
        if (role === "user") {
          res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
          return;
        }
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        res.status(404).json({ message: "Not found", code: "USER_NOT_FOUND" });
        return;
      }

      if (
        !testEnv &&
        role === "moderator" &&
        user.accommodationId &&
        (!userAccommodationId ||
          user.accommodationId.toString() !== userAccommodationId.toString())
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async joinAccommodationByCode(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { code } = req.body;
      const { role } = req;

      if (!code) {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }

      const accommodation = await Accommodation.findOne({ code });

      if (!accommodation) {
        res
          .status(404)
          .json({ message: "Not found", code: "ACCOMMODATION_NOT_FOUND" });
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      if (role !== "admin" && user.accommodationId) {
        res.status(400).json({
          message: "User already belongs to an accommodation",
          code: "USER_ALREADY_BELONGS",
        });
        return;
      }

      user.accommodationId = accommodation._id;
      await user.save();
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      res.status(200).json(userWithoutPassword);
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

  async updateUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const {
        userId,
        role: userRole,
        accommodationId: userAccommodationId,
      } = req;

      let updatedData = req.body;
      const { username, email, role } = updatedData;

      if (!testEnv && userRole === "user" && userId !== id) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== id) {
          res.status(409).json({
            message: "Username already taken",
            code: "USERNAME_TAKEN",
          });
          return;
        }
      }

      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== id) {
          res
            .status(409)
            .json({ message: "Email already taken", code: "EMAIL_TAKEN" });
          return;
        }
      }

      if (role) {
        const possibleRoles = ["user", "moderator"];
        if (!possibleRoles.includes(role)) {
          res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
          return;
        }
      }

      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({ message: "Not found", code: "USER_NOT_FOUND" });
        return;
      }

      if (!testEnv && !user.accommodationId) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      if (
        !UserBusiness.moderatorCheckNotNeeded(
          testEnv,
          userRole,
          user._id.toString(),
          userId,
        )
      ) {
        const allowedFields = ["role", "accommodationId"];
        const attemptedFields = Object.keys(updatedData);
        const unauthorizedFields = attemptedFields.filter(
          (field) => !allowedFields.includes(field),
        );

        if (unauthorizedFields.length > 0) {
          res.status(403).json({
            message: "Moderators can only update role and accommodationId",
            code: "FORBIDDEN",
          });
          return;
        }
        if (
          user.accommodationId &&
          !AccommodationBusiness.hasAccess(
            testEnv,
            userRole,
            userAccommodationId,
            user.accommodationId.toString(),
          )
        ) {
          res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
          return;
        }
      }

      user.set(updatedData);
      await user.save();

      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();

      res.status(200).json(userWithoutPassword);
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

  async updateUserPasswordById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { userId, role } = req;
      const { currentPassword, newPassword } = req.body;

      if (!UserBusiness.canModifyObject(testEnv, role, id, userId)) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({ message: "Not found", code: "USER_NOT_FOUND" });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({
          message: "Current password is incorrect",
          code: "INCORRECT_PASSWORD",
        });
        return;
      }

      if (!newPassword) {
        res.status(400).json({
          message: "New password is required",
          code: "PASSWORD_REQUIRED",
        });
        return;
      }

      if (!validPasswordLength(newPassword)) {
        res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
          code: "PASSWORD_LENGTH",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      res.status(200).json(userWithoutPassword);
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

  async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { userId, role } = req;

      if (!UserBusiness.canModifyObject(testEnv, role, id, userId)) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await User.findByIdAndDelete(id);

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

  async filterUsers(req: Request, res: Response): Promise<void> {
    try {
      const { name, role } = req.query;
      const { role: userRole, accommodationId: userAccommodationId } = req;
      const possibleRoles = ["user", "moderator", "admin"];

      if (!testEnv && !userAccommodationId && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const params: QueryParamsUsers = {};

      if (name) {
        const regex = { $regex: name as string, $options: "i" };
        params.$or = [
          { firstName: regex },
          { lastName: regex },
          { username: regex },
        ];
      }

      if (typeof role === "string" && possibleRoles.includes(role)) {
        params.role = role as Role;
      } else if (role) {
        params.role = "user";
      }

      if (!testEnv && userRole !== "admin" && userAccommodationId) {
        params.accommodationId = new mongoose.Types.ObjectId(
          userAccommodationId,
        );
      }

      const users = await User.find(params).select("-password");
      res.status(200).json(users);
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

export default UserService;
