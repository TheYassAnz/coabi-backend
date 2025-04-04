import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token given." });
  }

  try {
    const secretKey = process.env.SECRET_KEY || "zDZEKIOazirnaz";
    const decoded = jwt.verify(token, secretKey);
    req.body.user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Invalid token." });
  }
};

export default authMiddleware;
