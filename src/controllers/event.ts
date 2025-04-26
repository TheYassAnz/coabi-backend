import Event from "../models/event";
import { Request, Response } from "express";
import mongoose from "mongoose";

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
}

const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const events = await Event.find();
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Not found" });
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

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
