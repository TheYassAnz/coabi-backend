import { validPasswordLength } from "../../utils/utils";

test("check password length", () => {
  expect(validPasswordLength("password")).toBe(true);
});

test("check password length", () => {
  expect(validPasswordLength("short")).toBe(false);
});
