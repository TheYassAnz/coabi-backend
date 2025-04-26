import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth/jwt";
import { verifyCsrfToken } from "../utils/auth/csrf";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  // exclude refresh and login request and check for CSRF token
  const excludedRoutes = ["/refresh", "/logout"];
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  if (
    req.path.includes(excludedRoutes[0]) ||
    req.path.includes(excludedRoutes[1])
  ) {
    const csrfToken = req.headers["x-csrf-token"];
    const csrfSecret = req.cookies.csrfSecret;

    if (
      !csrfToken ||
      !csrfSecret ||
      !verifyCsrfToken(csrfSecret, csrfToken.toString())
    ) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next();
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
