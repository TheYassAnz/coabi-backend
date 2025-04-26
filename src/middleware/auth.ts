import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth/jwt";
import { verifyCsrfToken } from "../utils/auth/csrf";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  // exclude refresh and login request and check for CSRF token
  const excludedRoutes = [
    "/api/register",
    "/api/login",
    "/api/refresh",
    "/api/logout",
  ];
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  for (const route of excludedRoutes) {
    if (req.path === route) {
      if (route === "/api/refresh" || route === "/api/logout") {
        const csrfToken = req.headers["x-csrf-token"];
        const csrfSecret = req.cookies.csrfSecret;
        if (
          !csrfToken ||
          !csrfSecret ||
          !verifyCsrfToken(csrfSecret, csrfToken.toString())
        ) {
          return res.status(403).json({ message: "Invalid CSRF token" });
        }
      }
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
