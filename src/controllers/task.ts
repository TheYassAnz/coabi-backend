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

const getOneTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération de la tâche.",
    });
  }
};

const createTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, weekly, done, user_id, accommodation_id } =
      req.body;

    if (
      !name ||
      !description ||
      weekly === undefined ||
      done === undefined ||
      !user_id ||
      !accommodation_id
    ) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const newTask = new Task({
      name,
      description,
      weekly,
      done,
      user_id,
      accommodation_id,
    });

    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la création de la tâche.",
    });
  }
};

const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de la tâche.",
    });
  }
};

const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    res.status(200).json({ message: "Tâche supprimée avec succès." });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de la tâche.",
    });
  }
};

export default {
  getAllTasks,
  getOneTask,
  createTask,
  updateTask,
  deleteTask,
};
