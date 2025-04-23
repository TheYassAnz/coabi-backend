export const split = (a: number, b: number): number => {
  return parseFloat((a / b).toFixed(2));
};

export const validPasswordLength = (password: string): boolean => {
  return password.length >= 8 && password.length <= 72;
};
