import Event from '../models/event';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Récupérer tous les événements
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des événements." });
    }
};