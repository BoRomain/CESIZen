import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";

const router = Router();

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
  res.json("User created successfully");
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
  res.json("User disabled successfully");
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
  res.json("User enabled successfully");
});

export default router;
