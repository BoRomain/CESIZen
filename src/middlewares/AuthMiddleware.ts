import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const AuthMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const SECRET_KEY = process.env["JWT_SECRET"] || "";
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    (req as any).user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

export default AuthMiddleware;
