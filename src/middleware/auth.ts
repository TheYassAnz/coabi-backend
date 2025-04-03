import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Il n'y a aucun token de renseigné." });
    return;
  }

  try {
    const secretKey = process.env.SECRET_KEY || "zDZEKIOazirnaz";
    const decoded = jwt.verify(token, secretKey);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide." });
  }
};

export default authMiddleware;
