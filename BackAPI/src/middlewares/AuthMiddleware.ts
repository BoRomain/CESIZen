import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    next();
  } catch {
    res.sendStatus(401);
  }
}

export async function AdminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || "";

    const payload = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;

    if (payload.role === "admin") {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(401);
  }
}
