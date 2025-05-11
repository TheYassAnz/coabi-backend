import { Request, Response } from "express";
import UserService from "../services/UserService";

const userService = new UserService();

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  return userService.getAllUsers(req, res);
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  return userService.getUserById(req, res);
};

const joinAccommodationByCode = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return userService.joinAccommodationByCode(req, res);
};

const updateUserById = async (req: Request, res: Response): Promise<any> => {
  return userService.updateUserById(req, res);
};

const updateUserPasswordById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  return userService.updateUserPasswordById(req, res);
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  return userService.deleteUserById(req, res);
};

const filterUsers = async (req: Request, res: Response): Promise<any> => {
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
