type Role = "user" | "moderator" | "admin" | undefined;

export const hasAccessToAccommodation = (
  role: Role,
  userAccommodationId: string | null | undefined,
  requestAccommodationId: string,
): boolean => {
  if (role === "admin") {
    return true;
  }

  if (role && userAccommodationId) {
    return userAccommodationId === requestAccommodationId;
  }

  return true;
};

export const canModifyAccommodation = (
  role: Role,
  userAccommodationId: string | null | undefined,
  requestAccommodationId: string,
): boolean => {
  if (role === "admin") {
    return true;
  }

  if (role && role === "moderator" && userAccommodationId) {
    return userAccommodationId === requestAccommodationId;
  }

  return true;
};
