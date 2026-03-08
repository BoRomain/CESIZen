import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";
const REFRESH_SECRET = process.env["REFRESH_SECRET"] || "";

export async function AuthMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || "";

    const payload = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;

    next();
  } catch (error) {
    res.sendStatus(401);
  }
}

export async function AdminAuthMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || "";

    const payload = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;

    if (payload.role === "admin") {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
}
