import Refund from "../models/refund";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { split } from "../utils/utils";

interface QueryParamsRefunds {
  title?: {
    $regex: string;
    $options: string;
  };
  toRefund?: {
    $gte?: number;
    $lte?: number;
  };
  roomateId?: string;
}

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const refunds = await Refund.find();
    return res.json(refunds);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createRefund = async (
  title: string,
  toRefund: number,
  userId: string,
  roomateId: string,
): Promise<any> => {
  try {
    const newRefund = new Refund({ title, toRefund, userId, roomateId });

    await newRefund.save();

    return newRefund;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new Error("ValidationError");
    }
    throw new Error("InternalServerError");
  }
};

const createRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, toSplit, userId, roomateIds } = req.body; // roomateIds is a string[]

    if (toSplit < 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (roomateIds.length === 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    const toRefund = split(toSplit, roomateIds.length + 1);

    const newRefunds = await Promise.all(
      roomateIds.map(async (roomateId: string) => {
        return await createRefund(title, toRefund, userId, roomateId);
      }),
    );

    return res.status(201).json(newRefunds);
  } catch (error: any) {
    if (error.message === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(refund);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const toRefund = req.body.toRefund;

    if (toRefund && toRefund < 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    const refund = await Refund.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!refund) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(refund);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ message: "Not found" });
    }

    await refund.deleteOne();
    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const filterRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, toRefundStart, toRefundEnd, roomateId } = req.query;

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

    if (roomateId) {
      params.roomateId = roomateId as string;
    }

    const refunds = await Refund.find(params);

    return res.status(200).json(refunds);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
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
