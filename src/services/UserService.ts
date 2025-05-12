import User from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { validPasswordLength } from "../utils/utils";
import { testEnv } from "../utils/env";
import { Role } from "../types/role";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";
import Accommodation from "../models/accommodation";
import { authorizedToModify } from "../utils/auth/user";

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
  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const { role, accommodationId: userAccommodationId } = req;
      const { adminUI } = req.query;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
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
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { accommodationId: userAccommodationId, role } = req;

      if (!testEnv && role !== "admin" && id !== req.userId) {
        if (role === "user") {
          return res
            .status(403)
            .json({ message: "Forbidden", code: "FORBIDDEN" });
        }
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({ message: "Not found", code: "USER_NOT_FOUND" });
      }

      if (
        !testEnv &&
        role === "moderator" &&
        user.accommodationId &&
        (!userAccommodationId ||
          user.accommodationId.toString() !== userAccommodationId.toString())
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async joinAccommodationByCode(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.params.id;
      const { code } = req.body;
      const { role } = req;

      if (!code) {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }

      const accommodation = await Accommodation.findOne({ code });

      if (!accommodation) {
        return res
          .status(404)
          .json({ message: "Not found", code: "ACCOMMODATION_NOT_FOUND" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
      }

      if (role !== "admin" && user.accommodationId) {
        return res.status(400).json({
          message: "User already belongs to an accommodation",
          code: "USER_ALREADY_BELONGS",
        });
      }

      user.accommodationId = accommodation._id;
      await user.save();
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async updateUserById(req: Request, res: Response): Promise<any> {
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
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== id) {
          return res.status(409).json({
            message: "Username already taken",
            code: "USERNAME_TAKEN",
          });
        }
      }

      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== id) {
          return res
            .status(409)
            .json({ message: "Email already taken", code: "EMAIL_TAKEN" });
        }
      }

      if (role) {
        const possibleRoles = ["user", "moderator"];
        if (!possibleRoles.includes(role)) {
          return res
            .status(400)
            .json({ message: "Bad request", code: "BAD_REQUEST" });
        }
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ message: "Not found", code: "USER_NOT_FOUND" });
      }

      if (!testEnv && !user.accommodationId) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      if (
        !testEnv &&
        userId !== user._id.toString() &&
        userRole === "moderator"
      ) {
        const allowedFields = ["role", "accommodationId"];
        const attemptedFields = Object.keys(updatedData);
        const unauthorizedFields = attemptedFields.filter(
          (field) => !allowedFields.includes(field),
        );

        if (unauthorizedFields.length > 0) {
          return res.status(403).json({
            message: "Moderators can only update role and accommodationId",
            code: "FORBIDDEN",
          });
        }
        if (
          user.accommodationId &&
          !hasAccessToAccommodation(
            userRole,
            userAccommodationId,
            user.accommodationId.toString(),
          )
        ) {
          return res
            .status(403)
            .json({ message: "Forbidden", code: "FORBIDDEN" });
        }
      }

      user.set(updatedData);
      await user.save();

      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();

      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async updateUserPasswordById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;
      const { userId, role } = req;
      const { currentPassword, newPassword } = req.body;

      if (!authorizedToModify(role, id, userId)) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ message: "Not found", code: "USER_NOT_FOUND" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
          code: "INCORRECT_PASSWORD",
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required",
          code: "PASSWORD_REQUIRED",
        });
      }

      if (!validPasswordLength(newPassword)) {
        return res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
          code: "PASSWORD_LENGTH",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;
      const { userId, role } = req;

      if (!testEnv && role !== "admin" && userId !== id) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      await User.findByIdAndDelete(id);

      return res.sendStatus(204);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async filterUsers(req: Request, res: Response): Promise<any> {
    try {
      const { name, role } = req.query;
      const { role: userRole, accommodationId: userAccommodationId } = req;
      const possibleRoles = ["user", "moderator", "admin"];

      if (!testEnv && !userAccommodationId && userRole !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
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
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}

export default UserService;
