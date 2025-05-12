import { Request, Response } from "express";
import TaskService from "../services/TaskService";

const taskService = new TaskService();

const getAllTasks = async (req: Request, res: Response): Promise<any> => {
  return taskService.getAllTasks(req, res);
};

const createTask = async (req: Request, res: Response): Promise<any> => {
  return taskService.createTask(req, res);
};

const getTaskById = async (req: Request, res: Response): Promise<any> => {
  return taskService.getTaskById(req, res);
};

const updateTaskById = async (req: Request, res: Response): Promise<any> => {
  return taskService.updateTaskById(req, res);
};

const deleteTaskById = async (req: Request, res: Response): Promise<any> => {
  return taskService.deleteTaskById(req, res);
};

const filterTasks = async (req: Request, res: Response): Promise<any> => {
  return taskService.filterTasks(req, res);
};

export default {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  filterTasks,
};
