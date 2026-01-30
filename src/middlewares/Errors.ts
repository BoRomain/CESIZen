import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errorMessage = "Internal Server Error";
  let statusCode = 500;

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      errorMessage = "La clé existe déjà";
      statusCode = 409;
    }
  }

  res.status(statusCode).json({ errorMessage, statusCode });
}
