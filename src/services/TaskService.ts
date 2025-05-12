import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";
import { testEnv } from "../utils/env";
import { authorizedToModify } from "../utils/auth/user";

interface QueryParamsTasks {
  name?: {
    $regex: string;
    $options: string;
  };
  weekly?: boolean;
  done?: boolean;
  userId?: string;
  accommodationId?: mongoose.Types.ObjectId;
}

class TaskService {
  async getAllTasks(req: Request, res: Response): Promise<any> {
    try {
      const { role, accommodationId: userAccommodationId } = req;
      const { adminUI } = req.query;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      let params: any = {};

      if (role !== "admin" && adminUI !== "true") {
        if (userAccommodationId) {
          params.accommodationId = new mongoose.Types.ObjectId(
            userAccommodationId,
          );
        }
      }

      const tasks = await Task.find(params);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async createTask(req: Request, res: Response): Promise<any> {
    try {
      const { name, description, userId, accommodationId } = req.body;
      const { role, accommodationId: userAccommodationId } = req;

      if (
        !hasAccessToAccommodation(role, userAccommodationId, accommodationId)
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      const newTask = new Task({
        name,
        description,
        userId,
        accommodationId,
      });

      await newTask.save();
      return res.status(201).json(newTask);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        return res
          .status(404)
          .json({ message: "Not found", code: "TASK_NOT_FOUND" });
      }

      if (
        !hasAccessToAccommodation(
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        )
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async updateTaskById(req: Request, res: Response): Promise<any> {
    try {
      const updateData = req.body;
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        return res
          .status(404)
          .json({ message: "Not found", code: "TASK_NOT_FOUND" });
      }

      if (
        !hasAccessToAccommodation(
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        ) ||
        !authorizedToModify(role, task.userId.toString(), userId) ||
        updateData.accommodationId
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      task.set(updateData);
      await task.save();

      return res.status(200).json(task);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Bad request", code: "BAD_REQUEST" });
      }
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async deleteTaskById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        return res
          .status(404)
          .json({ message: "Not found", code: "TASK_NOT_FOUND" });
      }

      if (
        !hasAccessToAccommodation(
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        ) ||
        !authorizedToModify(role, task.userId.toString(), userId)
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      await task.deleteOne();

      return res.sendStatus(204);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async filterTasks(req: Request, res: Response): Promise<any> {
    try {
      const { name, weekly, done, userId } = req.query;
      const { role, accommodationId: userAccommodationId } = req;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden", code: "FORBIDDEN" });
      }

      const params: QueryParamsTasks = {};

      if (name) {
        params.name = { $regex: name as string, $options: "i" };
      }

      if (weekly) {
        params.weekly = weekly === "true";
      }

      if (done) {
        params.done = done === "true";
      }

      if (userId) {
        params.userId = userId as string;
      }

      if (!testEnv && role !== "admin" && userAccommodationId) {
        params.accommodationId = new mongoose.Types.ObjectId(
          userAccommodationId,
        );
      }

      const events = await Task.find(params);

      return res.status(200).json(events);
    } catch (error: any) {
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}

export default TaskService;
