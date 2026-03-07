import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UtilisateurModel } from "../class/UtilisateurModel.js";
import jwt from "jsonwebtoken";

const router = Router();

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";

router.get("/", async (req, res) => {
  const users = await prisma.utilisateur.findMany({
    omit: { motDePasse: true },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.utilisateur.findUnique({
    where: {
      id: Number(id),
    },
    omit: { motDePasse: true },
  });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: UtilisateurModel = await prisma.utilisateur.findUniqueOrThrow({
      where: {
        email,
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
      res.json(newRefreshToken);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }
});

router.post("/create", async (req, res) => {
  const { nom, prenom, email, motDePasse } = req.body;

  if (!nom || !prenom || !email || !motDePasse) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const hashedPassword = await bcrypt.hash(motDePasse, 10);

  const user: UtilisateurModel = await prisma.utilisateur.create({
    data: {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      role: "user",
      status: true,
    },
  });
  res.json("Utilisateur créé avec succès");
});

router.post("/disable/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.utilisateur.update({
    where: {
      id: Number(id),
    },
    data: {
      status: false,
    },
  });
  res.json("Utilisateur désactivé avec succès");
});

router.post("/enable/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.utilisateur.update({
    where: {
      id: Number(id),
    },
    data: {
      status: true,
    },
  });
  res.json("Utilisateur activé avec succès");
});

export default router;
