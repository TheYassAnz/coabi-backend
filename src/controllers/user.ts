import { Request, Response } from "express";
import UserService from "../services/user-service";

const userService = new UserService();

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  return userService.getAllUsers(req, res);
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  return userService.getUserById(req, res);
};

const joinAccommodationByCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return userService.joinAccommodationByCode(req, res);
};

const updateUserById = async (req: Request, res: Response): Promise<void> => {
  return userService.updateUserById(req, res);
};

const updateUserPasswordById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  return userService.updateUserPasswordById(req, res);
};

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  return userService.deleteUserById(req, res);
};

const filterUsers = async (req: Request, res: Response): Promise<void> => {
  return userService.filterUsers(req, res);
};

export default {
  getAllUsers,
  getUserById,
  joinAccommodationByCode,
  updateUserById,
  updateUserPasswordById,
  deleteUserById,
  filterUsers,
};
