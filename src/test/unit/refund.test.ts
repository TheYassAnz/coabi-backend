import { split } from "../../utils/utils";

test("split", () => {
  expect(split(60, 3)).toBe(20);
});
