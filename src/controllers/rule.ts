import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRules = async (req: Request, res: Response): Promise<any> => {
  try {
    const rules = await Rule.find();
    return res.status(200).json({ message: "Ok", data: rules });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createRule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, accommodation_id } = req.body;

    const newRule = new Rule({
      title,
      description,
      accommodation_id,
    });

    await newRule.save();
    return res.status(201).json({ message: "Ok", data: newRule });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Ok", data: rule });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Ok", data: rule });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findByIdAndDelete(id);

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default {
  getAllRules,
  createRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
};
