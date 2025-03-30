import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRules = async (req: Request, res: Response) => {
  try {
    const rules = await Rule.find();
    res.status(200).json({ rules });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des règles.",
    });
  }
};

const getOneRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const rule = await Rule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: "Règle non trouvée." });
    }

    res.status(200).json(rule);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la récupération de la règle.",
      });
  }
};

export default {
  getAllRules,
  getOneRule,
  // createRule,
  // updateRule,
  // deleteRule
};
