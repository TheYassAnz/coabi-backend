import { Role } from "../../types/role";

export class AccommodationBusiness {
  /**
   * Checks if a user has access to a specific accommodation.
   * @param role - The role of the current user.
   * @param userAccommodationId - The ID of the user's accommodation.
   * @param requestAccommodationId - The ID of the requested accommodation.
   * @returns true if the user has access, false otherwise.
   */
  static hasAccess(
    testEnv: boolean,
    role: Role,
    userAccommodationId: string | null | undefined,
    requestAccommodationId: string,
  ): boolean {
    if (testEnv || role === "admin") {
      return true;
    }
    return userAccommodationId === requestAccommodationId;
  }

  /**
   * Checks if a user can modify a specific accommodation.
   * @param role - The role of the current user.
   * @param userAccommodationId - The ID of the user's accommodation.
   * @param requestAccommodationId - The ID of the accommodation to modify.
   * @returns true if the user can modify the accommodation, false otherwise.
   */
  static canModify(
    testEnv: boolean,
    role: Role,
    userAccommodationId: string | null | undefined,
    requestAccommodationId: string,
  ): boolean {
    if (testEnv || role === "admin") {
      return true;
    }
    return (
      role === "moderator" && userAccommodationId === requestAccommodationId
    );
  }
}
