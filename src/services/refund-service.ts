import Refund from "../models/refund";
import User from "../models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { split } from "../utils/utils";
import { testEnv } from "../utils/env";
import { UserBusiness } from "./business/user-business";
import { AccommodationBusiness } from "./business/accommodation-business";

interface QueryParamsRefunds {
  title?: {
    $regex: string;
    $options: string;
  };
  toRefund?: {
    $gte?: number;
    $lte?: number;
  };
  userId?: string;
  roommateId?: string;
  accommodationId?: mongoose.Types.ObjectId;
}

class RefundService {
  async getAllRefunds(req: Request, res: Response): Promise<void> {
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

      const refunds = await Refund.find(params);
      res.json(refunds);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  private async createRefund(
    title: string,
    toRefund: number,
    userId: string,
    roommateId: string,
    accommodationId: string,
    res: Response,
  ): Promise<any> {
    try {
      const newRefund = new Refund({
        title,
        toRefund,
        userId,
        roommateId,
        accommodationId,
      });

      await newRefund.save();

      return newRefund;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return null;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return null;
    }
  }

  async createRefunds(req: Request, res: Response): Promise<void> {
    try {
      const { title, toSplit, userId, roommateIds, accommodationId } = req.body;
      const {
        role,
        accommodationId: userAccommodationId,
        userId: requestUserId,
      } = req;

      if (requestUserId && requestUserId !== userId) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      let roommates = await User.find({ _id: { $in: roommateIds } });

      if (role && role !== "admin" && userAccommodationId) {
        roommates = roommates.filter(
          (roommate: any) =>
            roommate.accommodationId.toString() === userAccommodationId,
        );
        if (roommates.length === 0) {
          res
            .status(404)
            .json({ message: "Not found", code: "ROOMMATE_NOT_FOUND" });
          return;
        }
      }

      if (toSplit < 0) {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }

      if (roommateIds.length === 0) {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }

      const toRefund = split(toSplit, roommateIds.length + 1);

      const newRefunds = await Promise.all(
        roommateIds.map(async (roommateId: string) => {
          return await this.createRefund(
            title,
            toRefund,
            userId,
            roommateId,
            accommodationId,
            res,
          );
        }),
      );

      res.status(201).json(newRefunds);
      return;
    } catch (error: any) {
      if (error.message === "ValidationError") {
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

  async getRefundById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const refund = await Refund.findById(id);

      if (!refund) {
        res
          .status(404)
          .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          refund.accommodationId.toString(),
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      res.status(200).json(refund);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async updateRefundById(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const refund = await Refund.findById(id);

      if (!refund) {
        res
          .status(404)
          .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          refund.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          refund.userId.toString(),
          userId,
        ) ||
        updateData.accommodationId ||
        updateData.userId ||
        updateData.roommateId
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      refund.set(updateData);
      await refund.save();

      res.status(200).json(refund);
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

  async deleteRefundById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const refund = await Refund.findById(id);

      if (!refund) {
        res
          .status(404)
          .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          refund.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          refund.userId.toString(),
          userId,
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await refund.deleteOne();
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

  async filterRefunds(req: Request, res: Response): Promise<void> {
    try {
      const { title, toRefundStart, toRefundEnd, userId, roommateId } =
        req.query;
      const { role, accommodationId: userAccommodationId } = req;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const params: QueryParamsRefunds = {};

      if (title) {
        params.title = { $regex: title as string, $options: "i" };
      }

      if (toRefundStart || toRefundEnd) {
        params.toRefund = {};
        if (toRefundStart) {
          params.toRefund.$gte = Number(toRefundStart as string);
        }
        if (toRefundEnd) {
          params.toRefund.$lte = Number(toRefundEnd as string);
        }
      }

      if (userId) {
        params.userId = userId as string;
      }

      if (roommateId) {
        params.roommateId = roommateId as string;
      }

      if (role !== "admin" && userAccommodationId) {
        params.accommodationId = new mongoose.Types.ObjectId(
          userAccommodationId,
        );
      }

      const refunds = await Refund.find(params)
        .populate("userId", "username")
        .populate("roommateId", "username");

      res.status(200).json(refunds);

      console.log(refunds);
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

export default RefundService;
