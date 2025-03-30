import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des tâches.",
    });
  }
};

const getOneTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: "Tâche non trouvée." });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération de la tâche.",
    });
  }
};

export default {
  getAllTasks,
  getOneTask,
  //   createTask,
  //   updateTask,
  //   deleteTask,
};
