import { AccommodationBusiness } from "../../services/business/accommodation-business";

describe("AccommodationBusiness", () => {
  test("should allow admin to access any accommodation", () => {
    expect(AccommodationBusiness.hasAccess(false, "admin", null, "123")).toBe(
      true,
    );
  });

  test("should allow moderator to access their own accommodation", () => {
    expect(
      AccommodationBusiness.hasAccess(false, "moderator", "123", "123"),
    ).toBe(true);
  });

  test("should deny moderator access to another accommodation", () => {
    expect(
      AccommodationBusiness.hasAccess(false, "moderator", "123", "456"),
    ).toBe(false);
  });

  test("should allow admin to modify any accommodation", () => {
    expect(AccommodationBusiness.canModify(false, "admin", null, "123")).toBe(
      true,
    );
  });

  test("should allow moderator to modify their own accommodation", () => {
    expect(
      AccommodationBusiness.canModify(false, "moderator", "123", "123"),
    ).toBe(true);
  });
});
