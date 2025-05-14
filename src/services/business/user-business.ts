export class UserBusiness {
  /**
   * Checks if a user has the right to modify an object.
   * @param role - The role of the current user.
   * @param objectUserId - The ID of the user who owns the object.
   * @param userId - The ID of the current user.
   * @returns true if the user can modify the object, false otherwise.
   */
  static canModifyObject(
    testEnv: boolean,
    role: string | undefined,
    objectUserId: string,
    userId: string | null | undefined,
  ): boolean {
    return testEnv || role === "admin" || objectUserId === userId;
  }

  /**
   * Checks if a moderator is trying to modify another user's object.
   * @param testEnv - If the application is in test mode.
   * @param userRole - The role of the current user.
   * @param userId - The ID of the current user.
   * @param targetUserId - The ID of the target user.
   * @returns true if the modification is needed and allowed, false otherwise.
   */
  static moderatorCheckNotNeeded(
    testEnv: boolean,
    role: string | undefined,
    targetUserId: string,
    userId: string | null | undefined,
  ): boolean {
    return testEnv || targetUserId === userId || role !== "moderator"; // if not mod then admin, user checked already
  }
}
