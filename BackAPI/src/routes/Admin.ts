import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UtilisateurModel } from "../class/UtilisateurModel.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { comparePassword } from "../utils/password.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: UtilisateurModel = await prisma.utilisateur.findUniqueOrThrow({
      where: {
        email,
        role: "admin",
        status: true,
      },
    });
    if (await comparePassword(password, user.motDePasse)) {
      const newRefreshToken = generateRefreshToken(user.id, user.role);
      await prisma.utilisateur.update({
        where: { id: user.id },
        data: {
          refreshToken: {
            upsert: {
              create: { token: newRefreshToken },
              update: { token: newRefreshToken },
            },
          },
        },
      });
      const newAT = generateAccessToken(user.id, user.role);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.json({ accessToken: newAT, user });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json({ error: "Email ou mot de passe incorrect" });
  }
});

export default router;
