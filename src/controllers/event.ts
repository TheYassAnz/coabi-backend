import { Request, Response } from "express";
import EventService from "../services/event-service";

const eventService = new EventService();

const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  return eventService.getAllEvents(req, res);
};

const createEvent = async (req: Request, res: Response): Promise<void> => {
  return eventService.createEvent(req, res);
};

const getEventById = async (req: Request, res: Response): Promise<void> => {
  return eventService.getEventById(req, res);
};

const updateEventById = async (req: Request, res: Response): Promise<void> => {
  return eventService.updateEventById(req, res);
};

const deleteEventById = async (req: Request, res: Response): Promise<void> => {
  return eventService.deleteEventById(req, res);
};

const filterEvents = async (req: Request, res: Response): Promise<void> => {
  return eventService.filterEvents(req, res);
};

export default {
  getAllEvents,
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  filterEvents,
};
