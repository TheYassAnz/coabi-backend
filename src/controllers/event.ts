import Event from "../models/event";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { hasAccessToAccommodation } from "../utils/auth/accommodation";
import { testEnv } from "../utils/env";
import accommodation from "./accommodation";

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

const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { role, accommodationId: userAccommodationId } = req;
    const { adminUI } = req.query;

    if (!testEnv && !userAccommodationId && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
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
    return res.status(200).json(events);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createEvent = async (req: Request, res: Response): Promise<any> => {
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

    if (!hasAccessToAccommodation(role, userAccommodationId, accommodationId)) {
      return res.status(403).json({ message: "Forbidden" });
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
    return res.status(201).json(newEvent);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        event.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(event);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const updateData = req.body;
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        event.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    event.set(updateData);
    await event.save();

    return res.status(200).json(event);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, accommodationId: userAccommodationId } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      !hasAccessToAccommodation(
        role,
        userAccommodationId,
        event.accommodationId.toString(),
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await event.deleteOne();

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const filterEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, plannedDateStart, plannedDateEnd, userId } = req.query;
    const { role, accommodationId: userAccommodationId } = req;

    if (!testEnv && !userAccommodationId && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
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
      params.accommodationId = new mongoose.Types.ObjectId(userAccommodationId);
    }

    const events = await Event.find(params);

    return res.status(200).json(events);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default {
  getAllEvents,
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  filterEvents,
};
