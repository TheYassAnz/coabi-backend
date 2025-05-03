import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";

const getAllRules = async (req: Request, res: Response): Promise<any> => {
  const role = req.role;
  if (role && role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const rules = await Rule.find();
    return res.status(200).json(rules);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createRule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, accommodationId } = req.body;
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!hasAccessToAccommodation(role, userAccommodationId, accommodationId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newRule = new Rule({
      title,
      description,
      accommodationId,
    });

    await newRule.save();
    return res.status(201).json(newRule);
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
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(rule);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    rule.set(updateData);
    await rule.save();

    return res.status(200).json(rule);
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
    const role = req.role;
    const userAccommodationId = req.accommodationId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await rule.deleteOne();

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
