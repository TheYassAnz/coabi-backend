import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string | JwtPayload;
      accommodationId?: string | null;
      role: "user" | "moderator" | "admin";
    }
  }
}
