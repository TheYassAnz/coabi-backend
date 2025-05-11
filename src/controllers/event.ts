import { Request, Response } from "express";
import EventService from "../services/EventService";

const eventService = new EventService();

const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  return eventService.getAllEvents(req, res);
};

const createEvent = async (req: Request, res: Response): Promise<any> => {
  return eventService.createEvent(req, res);
};

const getEventById = async (req: Request, res: Response): Promise<any> => {
  return eventService.getEventById(req, res);
};

const updateEventById = async (req: Request, res: Response): Promise<any> => {
  return eventService.updateEventById(req, res);
};

const deleteEventById = async (req: Request, res: Response): Promise<any> => {
  return eventService.deleteEventById(req, res);
};

const filterEvents = async (req: Request, res: Response): Promise<any> => {
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
