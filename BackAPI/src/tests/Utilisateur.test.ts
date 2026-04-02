import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

jest.mock("../database.js", () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      deleteMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  },
}));

jest.mock("../utils/password.js", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock("../utils/token.js", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

import prisma from "../database.js";
import * as passwordUtils from "../utils/password.js";
import * as tokenUtils from "../utils/token.js";
import utilisateurRouter from "../routes/Utilisateur.js";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/utilisateur", utilisateurRouter);
  return app;
};

describe("Utilisateur routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("POST /utilisateur/login returns access token and sets refresh cookie", async () => {
    const prismaMock = prisma as any;
    prismaMock.utilisateur.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      role: "user",
      motDePasse: "hashed-password",
    });
    prismaMock.utilisateur.update.mockResolvedValue({});
    (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);
    (tokenUtils.generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");
    (tokenUtils.generateAccessToken as jest.Mock).mockReturnValue("access-token");

    const response = await request(buildApp())
      .post("/utilisateur/login")
      .send({ email: "john@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ accessToken: "access-token" });
    expect(response.headers["set-cookie"]?.[0]).toContain("refreshToken=refresh-token");
    expect(prismaMock.utilisateur.update).toHaveBeenCalled();
  });

  it("POST /utilisateur/login returns 400 on invalid credentials", async () => {
    const prismaMock = prisma as any;
    prismaMock.utilisateur.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      role: "user",
      motDePasse: "hashed-password",
    });
    (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false);

    const response = await request(buildApp())
      .post("/utilisateur/login")
      .send({ email: "john@example.com", password: "wrong-password" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email ou mot de passe incorrect" });
  });

  it("GET /utilisateur/get-user returns the authenticated user", async () => {
    const prismaMock = prisma as any;
    (tokenUtils.verifyAccessToken as jest.Mock).mockReturnValue({ id: 7 });
    prismaMock.utilisateur.findUniqueOrThrow.mockResolvedValue({
      id: 7,
      nom: "Doe",
      prenom: "John",
      email: "john@example.com",
      role: "user",
      status: true,
    });

    const response = await request(buildApp())
      .get("/utilisateur/get-user")
      .set("Authorization", "Bearer access-token");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 7, email: "john@example.com" });
  });

  it("PUT /utilisateur/update/:id returns 401 when access token is invalid", async () => {
    const prismaMock = prisma as any;
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("invalid token");
    });

    const response = await request(buildApp())
      .put("/utilisateur/update/1")
      .set("Authorization", "Bearer invalid-token")
      .send({ nom: "Updated" });

    expect(response.status).toBe(401);
    expect(prismaMock.utilisateur.update).not.toHaveBeenCalled();
  });

  it("PUT /utilisateur/update/:id updates user when access token is valid", async () => {
    const prismaMock = prisma as any;
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 1, role: "user" } as any);
    prismaMock.utilisateur.update.mockResolvedValue({ id: 1 });

    const response = await request(buildApp())
      .put("/utilisateur/update/1")
      .set("Authorization", "Bearer valid-token")
      .send({ nom: "Updated", prenom: "User", email: "user@example.com", role: "user", status: true });

    expect(response.status).toBe(200);
    expect(prismaMock.utilisateur.update).toHaveBeenCalled();
  });

  it("POST /utilisateur/enable/:id returns 401 for non-admin users", async () => {
    const prismaMock = prisma as any;
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 1, role: "user" } as any);

    const response = await request(buildApp())
      .post("/utilisateur/enable/1")
      .set("Authorization", "Bearer valid-user-token");

    expect(response.status).toBe(401);
    expect(prismaMock.utilisateur.update).not.toHaveBeenCalled();
  });

  it("POST /utilisateur/enable/:id enables user for admin users", async () => {
    const prismaMock = prisma as any;
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 99, role: "admin" } as any);
    prismaMock.utilisateur.update.mockResolvedValue({ id: 1, status: true });

    const response = await request(buildApp())
      .post("/utilisateur/enable/1")
      .set("Authorization", "Bearer valid-admin-token");

    expect(response.status).toBe(200);
    expect(prismaMock.utilisateur.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: { status: true },
      }),
    );
  });
});
