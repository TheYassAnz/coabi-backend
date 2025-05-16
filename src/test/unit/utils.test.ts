import { validPasswordLength } from "../../utils/utils";
import { generateRandomCode } from "../../utils/utils";
import { split } from "../../utils/utils";

test("check password length", () => {
  expect(validPasswordLength("password")).toBe(true);
});

test("check password length", () => {
  expect(validPasswordLength("short")).toBe(false);
});

test("generate random code", () => {
  expect(generateRandomCode()).toHaveLength(12);
});

test("split", () => {
  expect(split(60, 3)).toBe(20);
});
