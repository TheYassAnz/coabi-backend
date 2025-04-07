import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRules = async (req: Request, res: Response): Promise<any> => {
  try {
    const rules = await Rule.find();
    return res.status(200).json(rules);
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

const getRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(rule);
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error.",
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
    return res.status(201).json(newRule);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

const updateRule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const rule = await Rule.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!rule) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json(rule);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

const deleteRule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Bad request." });
    }

    const rule = await Rule.findByIdAndDelete(id);

    if (!rule) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.status(200).json({ message: "OK." });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export default {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
};
