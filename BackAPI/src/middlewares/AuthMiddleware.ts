import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authOnly(req: any, res: Response, next: NextFunction) {
  if (req.token) {
    jwt.verify(req.token, process.env["ACCESS_SECRET"] || "");
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
export function adminOnly(req: any, res: Response, next: NextFunction) {
  if (req.token) {
    const payload = jwt.verify(
      req.token,
      process.env["ACCESS_SECRET"] || "",
    ) as JwtPayload;
    if (payload.role === "admin") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
