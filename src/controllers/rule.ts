import { Request, Response } from "express";
import RuleService from "../services/rule-service";

const ruleService = new RuleService();

const getAllRules = async (req: Request, res: Response): Promise<void> => {
  return ruleService.getAllRules(req, res);
};

const createRule = async (req: Request, res: Response): Promise<void> => {
  return ruleService.createRule(req, res);
};

const getRuleById = async (req: Request, res: Response): Promise<void> => {
  return ruleService.getRuleById(req, res);
};

const updateRuleById = async (req: Request, res: Response): Promise<void> => {
  return ruleService.updateRuleById(req, res);
};

const deleteRuleById = async (req: Request, res: Response): Promise<void> => {
  return ruleService.deleteRuleById(req, res);
};

export default {
  getAllRules,
  createRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
};
