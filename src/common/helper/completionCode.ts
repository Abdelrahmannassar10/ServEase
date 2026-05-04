export const generateCode = () => {
  return Math.ceil(Math.random() * 9999 + 10000) as unknown as string;
};