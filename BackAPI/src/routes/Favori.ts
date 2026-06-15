import { Router, Request, Response } from "express";
import prisma from "../database.js";
import { verifyAccessToken } from "../utils/token.js";

const router = Router();

const getUserId = (req: Request, res: Response): number | null => {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || "";
  if (!token) {
    res.sendStatus(401);
    return null;
  }

  try {
    const payload = verifyAccessToken(token);
    if (!payload) {
      res.sendStatus(401);
      return null;
    }
    return payload.id;
  } catch {
    res.sendStatus(401);
    return null;
  }
};

router.get("/", async (req, res) => {
  const utilisateurId = getUserId(req, res);
  if (!utilisateurId) return;

  const favoris = await prisma.favori.findMany({
    where: { utilisateurId },
    include: { activiteDetente: true },
    orderBy: { id: "desc" },
  });
  res.json(favoris);
});

router.get("/ids", async (req, res) => {
  const utilisateurId = getUserId(req, res);
  if (!utilisateurId) return;

  const favoris = await prisma.favori.findMany({
    where: { utilisateurId },
    select: { activiteDetenteId: true },
  });
  res.json(favoris.map((favori) => favori.activiteDetenteId));
});

router.post("/:activiteDetenteId", async (req, res) => {
  const utilisateurId = getUserId(req, res);
  if (!utilisateurId) return;

  const activiteDetenteId = Number(req.params.activiteDetenteId);
  if (Number.isNaN(activiteDetenteId)) {
    res.status(400).json({ error: "Invalid activity id" });
    return;
  }

  const favori = await prisma.favori.upsert({
    where: {
      utilisateurId_activiteDetenteId: { utilisateurId, activiteDetenteId },
    },
    update: {},
    create: { utilisateurId, activiteDetenteId },
  });

  res.json(favori);
});

router.delete("/:activiteDetenteId", async (req, res) => {
  const utilisateurId = getUserId(req, res);
  if (!utilisateurId) return;

  const activiteDetenteId = Number(req.params.activiteDetenteId);
  if (Number.isNaN(activiteDetenteId)) {
    res.status(400).json({ error: "Invalid activity id" });
    return;
  }

  await prisma.favori.deleteMany({
    where: { utilisateurId, activiteDetenteId },
  });

  res.json({ message: "favori removed" });
});

export default router;
