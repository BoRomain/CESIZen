import { Router } from "express";
import prisma from "../database.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UtilisateurModel } from "../class/UtilisateurModel.js";
import jwt from "jsonwebtoken";
import {
  AdminAuthMiddleware,
  AuthMiddleware,
} from "../middlewares/AuthMiddleware.js";

const router = Router();

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";
const REFRESH_SECRET = process.env["REFRESH_SECRET"] || "";

router.get("/", AdminAuthMiddleware, async (req, res) => {
  const { nom, prenom, email, role, page, limit } = req.query;
  const users = await prisma.utilisateur.findMany({
    where: {
      nom: nom ? { contains: String(nom), mode: "insensitive" } : undefined,
      prenom: prenom
        ? { contains: String(prenom), mode: "insensitive" }
        : undefined,
      email: email
        ? { contains: String(email), mode: "insensitive" }
        : undefined,
      role: role ? String(role) : undefined,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    omit: { motDePasse: true },
    orderBy: { dateCreation: "desc" },
  });
  res.json(users);
});

router.get("/get-user", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || "";

    const payload = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
    const user = (await prisma.utilisateur.findUniqueOrThrow({
      where: {
        id: payload.id,
      },
      omit: { motDePasse: true },
    })) as UtilisateurModel;
    res.json(user);
  } catch (error) {
    res.sendStatus(401);
  }
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
      const newRefreshToken = jwt.sign(
        { id: user.id, role: user.role },
        ACCESS_SECRET,
        {
          expiresIn: "7d",
        },
      );
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
      res.json({ accessToken: newAT });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json({ error: "Email ou mot de passe incorrect" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
      return res.sendStatus(400);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const payload = jwt.verify(
      tokenFromCookie,
      REFRESH_SECRET,
    ) as jwt.JwtPayload;
    await prisma.refreshToken.deleteMany({
      where: { token: tokenFromCookie, utilisateurId: payload.id },
    });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    if (!tokenFromCookie) return res.sendStatus(403);

    await prisma.refreshToken.findUniqueOrThrow({
      where: {
        token: tokenFromCookie,
      },
    });

    const payload = jwt.verify(
      tokenFromCookie,
      REFRESH_SECRET,
    ) as jwt.JwtPayload;

    const newRT = jwt.sign(
      { id: payload.id, role: payload.role },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
    const newAT = jwt.sign(
      { id: payload.id, role: payload.role },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    await prisma.utilisateur.update({
      where: { id: payload.id },
      data: {
        refreshToken: {
          upsert: {
            create: { token: newRT },
            update: { token: newRT },
          },
        },
      },
    });

    res.cookie("refreshToken", newRT, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ accessToken: newAT });
  } catch (err) {
    return res.sendStatus(403);
  }
});

router.post("/create", async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

router.put("/update/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, role, status } = req.body;
  const user = await prisma.utilisateur.update({
    where: {
      id: Number(id),
    },
    data: {
      nom,
      prenom,
      email,
      role,
      status,
    },
  });
  res.json("Utilisateur mis à jour avec succès");
});

router.post("/disable/:id", AuthMiddleware, async (req, res) => {
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

router.post("/enable/:id", AdminAuthMiddleware, async (req, res) => {
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

export default router;
