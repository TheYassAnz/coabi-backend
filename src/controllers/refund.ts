import Refund from "../models/refund";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRefunds = async (req: Request, res: Response): Promise<any> => {
  try {
    const refunds = await Refund.find();
    return res.json({ refunds });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue." });
  }
};

const createRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, to_refund, user_id, roomate_id } = req.body;

    if (!title || to_refund === undefined || !user_id || !roomate_id) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const newRefund = new Refund({ title, to_refund, user_id, roomate_id });

    await newRefund.save();

    return res.status(201).json({ refund: newRefund });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur est survenue.", details: error });
  }
};

const getRefundById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ message: "Remboursement non trouvé." });
    }

    return res.status(200).json(refund);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Une erreur est survenu" });
  }
};

const deleteRefund = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return res.status(404).json({ message: "Remboursement non trouvé." });
    }

    await refund.deleteOne();
    return res.status(200).json({ message: "Remboursement bien supprimé." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la suppression." });
  }
};

export default {
  getAllRefunds,
  createRefund,
  getRefundById,
  deleteRefund,
};
