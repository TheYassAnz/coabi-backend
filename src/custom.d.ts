import { JwtPayload } from "jsonwebtoken";
import { Role } from "./types/role";

declare global {
  namespace Express {
    interface Request {
      userId?: string | JwtPayload;
      accommodationId?: string | null;
      role: Role;
    }
  }
}
