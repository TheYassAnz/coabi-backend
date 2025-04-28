import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth/jwt";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  if (process.env.NODE_ENV === "test") {
    // Need to create a test DB only for testing
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
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
