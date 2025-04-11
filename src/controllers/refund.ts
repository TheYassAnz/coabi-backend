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
  roomate_id?: string;
}

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const refunds = await Refund.find();
    return res.json({ message: "Ok", data: refunds });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const createRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, to_refund, user_id, roomate_id } = req.body;

    if (to_refund < 0) {
      return res.status(400).json({ message: "Bad request" });
    }

    const newRefund = new Refund({ title, to_refund, user_id, roomate_id });

    await newRefund.save();

    return res.status(201).json({ message: "Ok", data: newRefund });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: "Internal server error." });
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
      message: "Internal server error.",
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
    return res.status(500).json({ message: "Internal server error." });
  }
};

const filterRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, to_refund_start, to_refund_end, roomate_id } = req.query;

    console.log("Query Params:", req.query);
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

    if (roomate_id) {
      params.roomate_id = roomate_id as string;
    }

    const refunds = await Refund.find(params);

    return res.status(200).json({ message: "Ok", data: refunds });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default {
  getAllRefunds,
  createRefund,
  getRefundById,
  updateRefundById,
  deleteRefundById,
  filterRefunds,
};
