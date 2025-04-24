export const validPasswordLength = (password: string): boolean => {
  return password.length >= 8 && password.length <= 72;
};

export const generateRandomCode = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const split = (a: number, b: number): number => {
  return parseFloat((a / b).toFixed(2));
};
