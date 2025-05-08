import Refund from "../models/refund";
import User from "../models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { split } from "../utils/utils";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";
import { testEnv } from "../utils/env";
import { Role } from "../types/role";

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

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { role, accommodationId: userAccommodationId } = req;
    const { adminUI } = req.query;

    if (!testEnv && !userAccommodationId && role !== "admin") {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
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
    return res.json(refunds);
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const createRefund = async (
  title: string,
  toRefund: number,
  userId: string,
  roommateId: string,
  accommodationId: string,
  res: Response,
): Promise<any> => {
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
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const createRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, toSplit, userId, roommateIds, accommodationId } = req.body; // roommateIds is a string[]
    const {
      role,
      accommodationId: userAccommodationId,
      userId: requestUserId,
    } = req;

    if (requestUserId && requestUserId !== userId) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    let roommates = await User.find({ _id: { $in: roommateIds } });

    if (role && role !== "admin" && userAccommodationId) {
      roommates = roommates.filter(
        (roommate: any) =>
          roommate.accommodationId.toString() === userAccommodationId,
      );
      if (roommates.length === 0) {
        return res
          .status(404)
          .json({ message: "Not found", code: "ROOMMATE_NOT_FOUND" });
      }
    }

    if (toSplit < 0) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    if (roommateIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const toRefund = split(toSplit, roommateIds.length + 1);

    const newRefunds = await Promise.all(
      roommateIds.map(async (roommateId: string) => {
        return await createRefund(
          title,
          toRefund,
          userId,
          roommateId,
          accommodationId,
          res,
        );
      }),
    );

    return res.status(201).json(newRefunds);
  } catch (error: any) {
    if (error.message === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const getRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res
        .status(404)
        .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        refund.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    return res.status(200).json(refund);
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const updateRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const updateData = req.body;
    const { id } = req.params;
    const { userId, role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const toRefund = req.body.toRefund;

    if (toRefund && toRefund < 0) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res
        .status(404)
        .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        refund.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    if (!testEnv && role !== "admin" && userId !== refund.userId) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    refund.set(updateData);
    await refund.save();

    return res.status(200).json(refund);
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
};

const deleteRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId, role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res
        .status(404)
        .json({ message: "Not found", code: "REFUND_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        refund.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    if (!testEnv && role !== "admin" && userId !== refund.userId) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    await refund.deleteOne();
    return res.sendStatus(204);
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
  }
};

const filterRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, toRefundStart, toRefundEnd, userId, roommateId } = req.query;
    const { role, accommodationId: userAccommodationId } = req;

    if (!testEnv && !userAccommodationId && role !== "admin") {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
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
      params.accommodationId = new mongoose.Types.ObjectId(userAccommodationId);
    }

    const refunds = await Refund.find(params);

    return res.status(200).json(refunds);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export default {
  getAllRefunds,
  createRefunds,
  getRefundById,
  updateRefundById,
  deleteRefundById,
  filterRefunds,
};
