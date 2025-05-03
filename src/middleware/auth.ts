import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth/jwt";
import User from "../models/user";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  if (process.env.MONGODB_URI?.includes("test")) {
    // Skip authentication in for github actions tests
    return next();
  }

  // exclude routes from authentication
  const excludedRoutes = ["/register", "/login", "/refresh", "/logout"];

  for (const route of excludedRoutes) {
    if (req.path.includes(route)) {
      return next();
    }
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }
    req.accommodationId = user.accommodationId?.toString();
    req.role = user.role;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

export default authMiddleware;
