import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UtilisateurModel } from "../class/UtilisateurModel.js";
import jwt from "jsonwebtoken";

const router = Router();

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";
const REFRESH_SECRET = process.env["REFRESH_SECRET"] || "";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: UtilisateurModel = await prisma.utilisateur.findUniqueOrThrow({
      where: {
        email,
        role: "admin",
      },
    });
    if (await bcrypt.compare(password, user.motDePasse)) {
      const newRefreshToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: "7d",
      });
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
      const newAT = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: "15m",
      });
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
