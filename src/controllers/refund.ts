import Refund from "../models/refund";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRefunds = async (req: Request, res: Response) => {
  try {
    const refunds = await Refund.find();
    res.json({ refunds });
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};

const createRefund = async (req: Request, res: Response) => {
  try {
    const { title, to_refund, user_id, roomate_id } = req.body;

    if (!title || to_refund === undefined || !user_id || !roomate_id) {
      res.status(400).json({ error: "Tous les champs sont requis." });
      return;
    }

    const newRefund = new Refund({ title, to_refund, user_id, roomate_id });

    await newRefund.save();

    res.status(201).json({ refund: newRefund });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Une erreur est survenue.", details: error });
  }
};

const getOneRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      return;
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      res.status(404).json({ message: "Remboursement non trouvé." });
      return;
    }

    res.status(200).json(refund);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenu" });
  }
};

const deleteOneRefund = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      return;
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      res.status(404).json({ message: "Remboursement non trouvé." });
      return;
    }

    await refund.deleteOne();
    res.status(200).json({ message: "Remboursement bien supprimé." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la suppression." });
  }
};

export default {
  getAllRefunds,
  createRefund,
  getOneRefund,
  deleteOneRefund,
};
