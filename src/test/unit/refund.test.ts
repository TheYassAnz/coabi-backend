import { splitRefund } from "../../controllers/refund";

test("split refund", () => {
  expect(splitRefund(60, 2)).toBe(20);
});
