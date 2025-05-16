import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { testEnv } from "../utils/env";
import { AccommodationBusiness } from "./business/accommodation-business";

class RuleService {
  async getAllRules(req: Request, res: Response): Promise<void> {
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

      const rules = await Rule.find(params);
      res.status(200).json(rules);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async createRule(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, accommodationId } = req.body;
      const { role, accommodationId: userAccommodationId } = req;

      if (
        !AccommodationBusiness.canModify(
          testEnv,
          role,
          userAccommodationId,
          accommodationId,
        ) ||
        role === "user"
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const newRule = new Rule({
        title,
        description,
        accommodationId,
      });

      await newRule.save();
      res.status(201).json(newRule);
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

  async getRuleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const rule = await Rule.findById(id);

      if (!rule) {
        res.status(404).json({ message: "Not found", code: "RULE_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          rule.accommodationId.toString(),
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      res.status(200).json(rule);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async updateRuleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { role, accommodationId: userAccommodationId } = req;

      const rule = await Rule.findById(id);

      if (!rule) {
        res.status(404).json({ message: "Not found", code: "RULE_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.canModify(
          testEnv,
          role,
          userAccommodationId,
          rule.accommodationId.toString(),
        ) ||
        updateData.accommodationId
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      rule.set(updateData);
      await rule.save();

      res.status(200).json(rule);
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

  async deleteRuleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const rule = await Rule.findById(id);

      if (!rule) {
        res.status(404).json({ message: "Not found", code: "RULE_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.canModify(
          testEnv,
          role,
          userAccommodationId,
          rule.accommodationId.toString(),
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await rule.deleteOne();

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
}

export default RuleService;
