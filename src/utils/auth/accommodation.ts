import { testEnv } from "../env";
import { Role } from "../../types/role";

export const hasAccessToAccommodation = (
  role: Role,
  userAccommodationId: string | null | undefined,
  requestAccommodationId: string,
): boolean => {
  if (testEnv || role === "admin") {
    return true;
  }

  return userAccommodationId === requestAccommodationId;
};

export const canModifyAccommodation = (
  role: Role,
  userAccommodationId: string | null | undefined,
  requestAccommodationId: string,
): boolean => {
  if (testEnv || role === "admin") {
    return true;
  }

  if (role === "moderator") {
    return userAccommodationId === requestAccommodationId;
  }

  return false;
};
