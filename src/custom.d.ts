import { Role } from "./types/role";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      accommodationId?: string | null;
      role: Role;
    }
  }
}
