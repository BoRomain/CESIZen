import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();
const secret = process.env["JWT_SECRET"] || "";

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
  try {
    const { email, motDePasse } = req.body;
    const user = await prisma.utilisateur.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      secret,
      { expiresIn: "1h" },
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", async (req, res) => {
  const { nom, prenom, email, motDePasse } = req.body;

  if (!nom || !prenom || !email || !motDePasse) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(motDePasse, 10);

  const user = await prisma.utilisateur.create({
    data: {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      role: "user",
      dateCreation: new Date(),
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
