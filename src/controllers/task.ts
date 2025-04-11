import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllTasks = async (req: Request, res: Response): Promise<any> => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({ message: "Ok", data: tasks });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const createTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, weekly, done, user_id, accommodation_id } =
      req.body;

    const newTask = new Task({
      name,
      description,
      weekly,
      done,
      user_id,
      accommodation_id,
    });

    await newTask.save();
    return res.status(201).json({ message: "Ok", data: newTask });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getTaskById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request." });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Not found." });
    }

    return res.status(200).json({ message: "Ok", data: task });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const updateTaskById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request." });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Not found." });
    }

    return res.status(200).json({ message: "Ok", data: task });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const deleteTaskById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request." });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Not found." });
    }

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export default {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
