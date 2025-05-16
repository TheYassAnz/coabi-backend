import Event from "../models/event";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { testEnv } from "../utils/env";
import { UserBusiness } from "./business/user-business";
import { AccommodationBusiness } from "./business/accommodation-business";

interface QueryParamsEvents {
  title?: {
    $regex: string;
    $options: string;
  };
  plannedDate?: {
    $gte?: Date;
    $lte?: Date;
  };
  endDate?: Date;
  userId?: string;
  accommodationId?: mongoose.Types.ObjectId;
}

class EventService {
  async getAllEvents(req: Request, res: Response): Promise<void> {
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

      const events = await Event.find(params);
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

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        plannedDate,
        endDate,
        userId,
        accommodationId,
      } = req.body;
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

      const newEvent = new Event({
        title,
        description,
        plannedDate: new Date(plannedDate),
        endDate: new Date(endDate),
        userId,
        accommodationId,
      });

      await newEvent.save();
      res.status(201).json(newEvent);
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

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, accommodationId: userAccommodationId } = req;

      const event = await Event.findById(id);

      if (!event) {
        res.status(404).json({ message: "Not found", code: "EVENT_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          event.accommodationId.toString(),
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      res.status(200).json(event);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }

  async updateEventById(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const event = await Event.findById(id);

      if (!event) {
        res.status(404).json({ message: "Not found", code: "EVENT_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          event.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          event.userId.toString(),
          userId,
        ) ||
        updateData.accommodationId ||
        updateData.userId
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      event.set(updateData);
      await event.save();

      res.status(200).json(event);
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

  async deleteEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId, role, accommodationId: userAccommodationId } = req;

      const event = await Event.findById(id);

      if (!event) {
        res.status(404).json({ message: "Not found", code: "EVENT_NOT_FOUND" });
        return;
      }

      if (
        !AccommodationBusiness.hasAccess(
          testEnv,
          role,
          userAccommodationId,
          event.accommodationId.toString(),
        ) ||
        !UserBusiness.canModifyObject(
          testEnv,
          role,
          event.userId.toString(),
          userId,
        )
      ) {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      await event.deleteOne();

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

  async filterEvents(req: Request, res: Response): Promise<void> {
    try {
      const { title, plannedDateStart, plannedDateEnd, userId } = req.query;
      const { role, accommodationId: userAccommodationId } = req;

      if (!testEnv && !userAccommodationId && role !== "admin") {
        res.status(403).json({ message: "Forbidden", code: "FORBIDDEN" });
        return;
      }

      const params: QueryParamsEvents = {};

      if (title) {
        params.title = { $regex: title as string, $options: "i" };
      }

      if (plannedDateStart || plannedDateEnd) {
        params.plannedDate = {};
        if (plannedDateStart) {
          params.plannedDate.$gte = new Date(plannedDateStart as string);
        }
        if (plannedDateEnd) {
          params.plannedDate.$lte = new Date(plannedDateEnd as string);
        }
      }

      if (userId) {
        params.userId = userId as string;
      }

      if (!testEnv && role !== "admin" && userAccommodationId) {
        params.accommodationId = new mongoose.Types.ObjectId(
          userAccommodationId,
        );
      }

      const events = await Event.find(params);

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

export default EventService;
