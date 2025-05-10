import { testEnv } from "../env";

export const authorizedToModify = (
  role: string | undefined,
  objectUserId: string,
  userId: string | null | undefined,
) => {
  return testEnv || role === "admin" || objectUserId === userId;
};
