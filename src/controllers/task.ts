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

export default {
  getAllTasks,
  //   getOneTask,
  //   createTask,
  //   updateTask,
  //   deleteTask,
};
