import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";
const REFRESH_SECRET = process.env["REFRESH_SECRET"] || "";

export const generateAccessToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  try {
    if (!ACCESS_SECRET) throw new Error("Secret missing");

    return jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return undefined;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    if (!REFRESH_SECRET) throw new Error("Secret missing");
    return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return undefined;
  }
};
