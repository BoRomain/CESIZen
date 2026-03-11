import { Router } from "express";
import { AdminAuthMiddleware } from "../middlewares/AuthMiddleware";
import prisma from "../database";

const router = Router();

router.get("/", async (req, res) => {
  const { titre, page, limit } = req.query;
  const activites = await prisma.activiteDetente.findMany({
    where: {
      titre: titre ? { contains: String(titre), mode: "insensitive" } : undefined,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { dateModification: "desc" },
  });
  res.json(activites);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const activite = await prisma.activiteDetente.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(activite);
});

router.post("/create", AdminAuthMiddleware, async (req, res) => {
  const { titre, description, difficulte, duree, image, status, authorId } = req.body;
  const activite = await prisma.activiteDetente.create({
    data: {
      titre,
      description,
      difficulte,
      duree,
      image,
      status,
      authorId,
    },
  });
  res.json(activite);
});

router.put("/update/:id", AdminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { titre, description, difficulte, duree, image, status, authorId } = req.body;
  const activite = await prisma.activiteDetente.update({
    where: {
      id: Number(id),
    },
    data: {
      titre,
      description,
      difficulte,
      duree,
      image,
      status,
      authorId,
    },
  });
  res.json(activite);
});

router.delete("/delete/:id", AdminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.activiteDetente.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: "activite deleted successfully" });
});

export default router;
