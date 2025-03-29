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

// Récupérer un événement par ID
export const getOneEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
        }

        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ message: "Événement non trouvé." });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'événement." });
    }
};