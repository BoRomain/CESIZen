import { Router } from "express";
import prisma from "../database.js";
import { AdminAuthMiddleware } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/", async (req, res) => {
  const { titre, categorie, page, limit } = req.query;
  const informations = await prisma.information.findMany({
    where: {
      titre: titre
        ? { contains: String(titre), mode: "insensitive" }
        : undefined,
      categorie: categorie
        ? { contains: String(categorie), mode: "insensitive" }
        : undefined,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { dateCreation: "desc" },
  });
  res.json(informations);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const information = await prisma.information.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(information);
});

router.post("/create", AdminAuthMiddleware, async (req, res) => {
  const { titre, description, texte, image, categorie, status, authorId } =
    req.body;
  const information = await prisma.information.create({
    data: {
      titre,
      description,
      texte,
      image,
      categorie,
      status,
      authorId,
    },
  });
  res.json(information);
});

router.put("/:id", AdminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { titre, description, texte, image, categorie, status, authorId } =
    req.body;
  const information = await prisma.information.update({
    where: {
      id: Number(id),
    },
    data: {
      titre,
      description,
      texte,
      image,
      categorie,
      status,
      authorId,
    },
  });
  res.json(information);
});

router.delete("/:id", AdminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.information.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: "Information deleted successfully" });
});

export default router;
