import {
  csrfTokens,
  generateCsrfToken,
  verifyCsrfToken,
} from "../../../utils/auth/csrf";

test("generate csrf token", async () => {
  const secret = await csrfTokens.secret();
  const csrfToken = await generateCsrfToken(secret);
  const isValid = verifyCsrfToken(secret, csrfToken);
  expect(csrfToken).toBeDefined();
  expect(isValid).toBe(true);
});
