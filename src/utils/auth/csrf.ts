import Tokens from "csrf";

export const csrfTokens = new Tokens();

export const generateCsrfToken = async (secret: string) => {
  return csrfTokens.create(secret);
};

export const verifyCsrfToken = (secret: string, token: string) => {
  return csrfTokens.verify(secret, token);
};
