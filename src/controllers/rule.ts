import Rule from "../models/rule";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllRules = async (req: Request, res: Response) => {
  try {
    const rules = await Rule.find();
    res.status(200).json({ rules });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la récupération des règles.",
      });
  }
};

export default {
  getAllRules,
  // getOneRule,
  // createRule,
  // updateRule,
  // deleteRule
};
