import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.utilisateur.findMany();
  res.json(users);
});

router.post("/create", async (req, res) => {
  const { nom, prenom, email, motDePasse} = req.body;

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
      status: true
    }
  })
  res.json("User created successfully");
});

router.post("/disable/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.utilisateur.update({
    where: {
      id: Number(id)
    },
    data: {
      status: false
    }
  });
  res.json(user);
});

router.post("/enable/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.utilisateur.update({
    where: {
      id: Number(id)
    },
    data: {
      status: true
    }
  });
  res.json(user);
});

export default router;
