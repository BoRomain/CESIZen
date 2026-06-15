import { Router } from "express";
import prisma from "../database.js";
import "dotenv/config";
import { UtilisateurModel } from "../class/UtilisateurModel.js";
import {
  AdminAuthMiddleware,
  AuthMiddleware,
} from "../middlewares/AuthMiddleware.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const router = Router();

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
    orderBy: { dateModification: "desc" },
  });
  res.json(users);
});

router.get("/count", AdminAuthMiddleware, async (req, res) => {
  const count = await prisma.utilisateur.count();
  res.json({ count });
});

router.get("/status-count", AdminAuthMiddleware, async (req, res) => {
  const [active, inactive] = await Promise.all([
    prisma.utilisateur.count({ where: { status: true } }),
    prisma.utilisateur.count({ where: { status: false } }),
  ]);
  res.json({ active, inactive });
});

router.get("/get-user", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || "";

    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.sendStatus(401);
    }

    const user = await prisma.utilisateur.findUniqueOrThrow({
      where: {
        id: payload.id,
        status: true,
      },
      omit: { motDePasse: true },
    });
    res.json(user);
  } catch {
    res.sendStatus(401);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: UtilisateurModel = await prisma.utilisateur.findUniqueOrThrow({
      where: {
        email,
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
      res.json({ accessToken: newAT });
    } else {
      throw new Error();
    }
  } catch {
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

    const payload = verifyRefreshToken(tokenFromCookie);
    if (!payload) {
      return res.sendStatus(401);
    }
    await prisma.refreshToken.deleteMany({
      where: { token: tokenFromCookie, utilisateurId: payload.id },
    });
    res.sendStatus(200);
  } catch {
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

    const payload = verifyRefreshToken(tokenFromCookie);
    if (!payload) return res.sendStatus(403);

    const newRT = generateRefreshToken(payload.id, payload.role);
    const newAT = generateAccessToken(payload.id, payload.role);

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
  } catch {
    return res.sendStatus(403);
  }
});

router.post("/create", async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.utilisateur.create({
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
  const { nom, prenom, email, password, role, status } = req.body;
  await prisma.utilisateur.update({
    where: {
      id: Number(id),
    },
    data: {
      nom,
      prenom,
      email,
      role,
      status,
      dateModification: new Date(),
    },
  });

  if (password) {
    prisma.utilisateur.update({
      where: {
        id: Number(id),
      },
      data: {
        motDePasse: await hashPassword(password),
      },
    });
  }
  res.json("Utilisateur mis à jour avec succès");
});

router.delete("/delete/:id", AdminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.utilisateur.delete({
    where: {
      id: Number(id),
    },
  });
  res.json("Utilisateur supprimé avec succès");
});

router.post("/disable/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.utilisateur.update({
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
  await prisma.utilisateur.update({
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
