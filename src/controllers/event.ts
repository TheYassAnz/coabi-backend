import Event from "../models/event";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const events = await Event.find();
    return res.status(200).json({ message: "Ok", data: events });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const createEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      title,
      description,
      planned_date,
      end_date,
      user_id,
      accommodation_id,
    } = req.body;

    const newEvent = new Event({
      title,
      description,
      planned_date: new Date(planned_date),
      end_date: new Date(end_date),
      user_id,
      accommodation_id,
    });

    await newEvent.save();
    return res.status(201).json({ message: "Ok", data: newEvent });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error.",
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
      return res.status(404).json({ message: "Not found." });
    }

    return res.status(200).json({ message: "Ok", data: event });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const updateEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request." });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!event) {
      return res.status(404).json({ message: "Not found." });
    }

    return res.status(200).json({ message: "Ok", data: event });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const deleteEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Bad request." });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
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
  getAllEvents,
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
};
