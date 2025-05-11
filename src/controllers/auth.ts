import { Request, Response } from "express";
import AuthService from "../services/AuthService";

const authService = new AuthService();

const register = async (req: Request, res: Response): Promise<any> => {
  return authService.register(req, res);
};

const login = async (req: Request, res: Response): Promise<any> => {
  return authService.login(req, res);
};

const refresh = async (req: Request, res: Response): Promise<any> => {
  return authService.refresh(req, res);
};

const logout = async (req: Request, res: Response): Promise<any> => {
  return authService.logout(req, res);
};

export default {
  register,
  login,
  refresh,
  logout,
};
