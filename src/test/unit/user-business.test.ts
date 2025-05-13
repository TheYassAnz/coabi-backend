import { UserBusiness } from "../../services/business/user-business";

describe("UserBusiness", () => {
  test("should allow admin to modify any object", () => {
    expect(UserBusiness.canModifyObject(false, "admin", "123", "456")).toBe(
      true,
    );
  });

  test("should deny user to modify another user's object", () => {
    expect(UserBusiness.canModifyObject(false, "user", "123", "456")).toBe(
      false,
    );
  });

  test("should allow modification without moderator check environment", () => {
    expect(
      UserBusiness.moderatorCheckNotNeeded(false, "moderator", "456", "456"),
    ).toBe(true);
  });

  test("should not allow modification without moderator check environment", () => {
    expect(
      UserBusiness.moderatorCheckNotNeeded(false, "moderator", "124", "123"),
    ).toBe(false);
  });
});
