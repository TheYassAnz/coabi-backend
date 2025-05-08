import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";
import { testEnv } from "../utils/env";

const getAllRules = async (req: Request, res: Response): Promise<any> => {
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

    const rules = await Rule.find(params);
    return res.status(200).json(rules);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

const createRule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, accommodationId } = req.body;
    const { role, accommodationId: userAccommodationId } = req;

    if (!hasAccessToAccommodation(role, userAccommodationId, accommodationId)) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
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

const getRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res
        .status(404)
        .json({ message: "Not found", code: "RULE_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    return res.status(200).json(rule);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

const updateRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res
        .status(404)
        .json({ message: "Not found", code: "RULE_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    rule.set(updateData);
    await rule.save();

    return res.status(200).json(rule);
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

const deleteRuleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Bad request", code: "BAD_REQUEST" });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res
        .status(404)
        .json({ message: "Not found", code: "RULE_NOT_FOUND" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        rule.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
    }

    await rule.deleteOne();

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
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
