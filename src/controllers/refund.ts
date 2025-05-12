import { Request, Response } from "express";
import RefundService from "../services/RefundService";

const refundService = new RefundService();

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  return refundService.getAllRefunds(req, res);
};

const createRefunds = async (req: Request, res: Response): Promise<any> => {
  return refundService.createRefunds(req, res);
};

const getRefundById = async (req: Request, res: Response): Promise<any> => {
  return refundService.getRefundById(req, res);
};

const updateRefundById = async (req: Request, res: Response): Promise<any> => {
  return refundService.updateRefundById(req, res);
};

const deleteRefundById = async (req: Request, res: Response): Promise<any> => {
  return refundService.deleteRefundById(req, res);
};

const filterRefunds = async (req: Request, res: Response): Promise<any> => {
  return refundService.filterRefunds(req, res);
};

export default {
  getAllRefunds,
  createRefunds,
  getRefundById,
  updateRefundById,
  deleteRefundById,
  filterRefunds,
};
