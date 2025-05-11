import { Request, Response } from "express";
import RuleService from "../services/RuleService";

const ruleService = new RuleService();

const getAllRules = async (req: Request, res: Response): Promise<any> => {
  return ruleService.getAllRules(req, res);
};

const createRule = async (req: Request, res: Response): Promise<any> => {
  return ruleService.createRule(req, res);
};

const getRuleById = async (req: Request, res: Response): Promise<any> => {
  return ruleService.getRuleById(req, res);
};

const updateRuleById = async (req: Request, res: Response): Promise<any> => {
  return ruleService.updateRuleById(req, res);
};

const deleteRuleById = async (req: Request, res: Response): Promise<any> => {
  return ruleService.deleteRuleById(req, res);
};

export default {
  getAllRules,
  createRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
};
