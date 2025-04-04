import Refund from "../models/refund";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const refunds = await Refund.find();
    return res.json({ refunds });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const createRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, to_refund, user_id, roomate_id } = req.body;

    if (!title || to_refund === undefined || !user_id || !roomate_id) {
      return res.status(400).json({ error: "Bad request." });
    }

    const newRefund = new Refund({ title, to_refund, user_id, roomate_id });

    await newRefund.save();

    return res.status(201).json({ refund: newRefund });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

const updateRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const refund = await Refund.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!refund) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(refund);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

const getRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(refund);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ error: "Not found." });
    }

    await refund.deleteOne();
    return res.status(200).json({ message: "OK." });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default {
  getAllRefunds,
  createRefund,
  getRefundById,
  updateRefund,
  deleteRefund,
};
