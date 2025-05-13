import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { testEnv } from "../utils/env";
import { UserBusiness } from "./business/user-business";
import { AccommodationBusiness } from "./business/accommodation-business";

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
  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const { role, accommodationId: userAccommodationId } = req;
      const { adminUI } = req.query;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
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
      res.status(200).json(tasks);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, userId, accommodationId } = req.body;
      const { role, accommodationId: userAccommodationId } = req;

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          accommodationId,
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const newTask = new Task({
        name,
        description,
        userId,
        accommodationId,
      });

      await newTask.save();
      res.status(201).json(newTask);
      return;
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({ message: "Not found", code: "TASK_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      res.status(200).json(task);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async updateTaskById(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({ message: "Not found", code: "TASK_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          task.userId.toString(),
          userId,
        ) ||
        updateData.accommodationId
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      task.set(updateData);
      await task.save();

      res.status(200).json(task);
      return;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: "Bad request", code: "BAD_REQUEST" });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async deleteTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({ message: "Not found", code: "TASK_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          task.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          task.userId.toString(),
          userId,
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await task.deleteOne();

      res.sendStatus(204);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async filterTasks(req: Request, res: Response): Promise<void> {
    try {
      const { name, weekly, done, userId } = req.query;
      const { role, accommodationId: userAccommodationId } = req;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
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

      res.status(200).json(events);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
}

export default TaskService;
