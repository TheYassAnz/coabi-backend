import Event from "../models/event";
import { Request, Response } from "express";
import mongoose from "mongoose";

const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const events = await Event.find();
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des événements.",
    });
  }
};

const getEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération de l'événement.",
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

    if (
      !title ||
      !description ||
      !planned_date ||
      !end_date ||
      !user_id ||
      !accommodation_id
    ) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const newEvent = new Event({
      title,
      description,
      planned_date: new Date(planned_date),
      end_date: new Date(end_date),
      user_id,
      accommodation_id,
    });

    await newEvent.save();
    return res.status(201).json({ event: newEvent });
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la création de l'événement.",
    });
  }
};

const updateEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de l'événement.",
    });
  }
};

const deleteEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    return res.status(200).json({ message: "Événement supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de l'événement.",
    });
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
