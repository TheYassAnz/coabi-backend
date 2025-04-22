import Refund from "../models/refund";
import { Request, Response } from "express";
import mongoose from "mongoose";

interface QueryParamsRefunds {
  title?: {
    $regex: string;
    $options: string;
  };
  to_refund?: {
    $gte?: number;
    $lte?: number;
  };
  roommate_id?: string;
}

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const refunds = await Refund.find();
    return res.json({ message: "Ok", data: refunds });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const splitRefund = (to_split: number, roommates: number): number => {
  return parseFloat((to_split / (roommates + 1)).toFixed(2));
};

const createRefund = async (
  title: string,
  to_refund: number,
  user_id: string,
  roommate_id: string,
): Promise<any> => {
  try {
    const newRefund = new Refund({ title, to_refund, user_id, roommate_id });

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
    const { title, to_split, user_id, roommate_ids } = req.body; // roommate_ids is a string[]

    if (to_split < 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (roommate_ids.length === 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    const to_refund = splitRefund(to_split, roommate_ids.length);

    const newRefunds = await Promise.all(
      roommate_ids.map(async (roommate_id: string) => {
        return await createRefund(title, to_refund, user_id, roommate_id);
      }),
    );

    return res.status(201).json({ message: "Ok", data: newRefunds });
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

    return res.status(200).json({ message: "Ok", data: refund });
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

    const to_refund = req.body.to_refund;

    if (to_refund && to_refund < 0) {
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

    return res.status(200).json({ message: "Ok", data: refund });
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
    const { title, to_refund_start, to_refund_end, roommate_id } = req.query;

    const params: QueryParamsRefunds = {};

    if (title) {
      params.title = { $regex: title as string, $options: "i" };
    }

    if (to_refund_start || to_refund_end) {
      params.to_refund = {};
      if (to_refund_start) {
        params.to_refund.$gte = Number(to_refund_start as string);
      }
      if (to_refund_end) {
        params.to_refund.$lte = Number(to_refund_end as string);
      }
    }

    if (roommate_id) {
      params.roommate_id = roommate_id as string;
    }

    const refunds = await Refund.find(params);

    return res.status(200).json({ message: "Ok", data: refunds });
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
