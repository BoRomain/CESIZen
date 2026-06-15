import express from "express";
import request from "supertest";

jest.mock("../database.js", () => ({
  __esModule: true,
  default: {
    activiteDetente: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "../database.js";
import activitiesRouter from "../routes/ActiviteDetente.js";
import cookieParser from "cookie-parser";

interface PrismaActiviteDetenteMock {
  findMany: jest.Mock;
  findUnique: jest.Mock;
  findUniqueOrThrow: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
}

interface PrismaRefreshTokenMock {
  deleteMany: jest.Mock;
  findUniqueOrThrow: jest.Mock;
}

interface PrismaMock {
  activiteDetente: PrismaActiviteDetenteMock;
  refreshToken: PrismaRefreshTokenMock;
}

const prismaMock = prisma as unknown as PrismaMock;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/information", activitiesRouter);
  return app;
};

describe("ActiviteDetente routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /activiteDetente returns filtered and paginated results", async () => {
    prismaMock.activiteDetente.findMany.mockResolvedValue([
      { id: 1, titre: "Respiration 4-7-8" },
    ]);

    const response = await request(buildApp()).get(
      "/activiteDetente?titre=resp&page=2&limit=5",
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(prismaMock.activiteDetente.findMany).toHaveBeenCalledWith({
      where: {
        titre: { contains: "resp", mode: "insensitive" },
      },
      skip: 5,
      take: 5,
      orderBy: { dateModification: "desc" },
    });
  });

  it("GET /activiteDetente/:id returns one activity", async () => {
    prismaMock.activiteDetente.findUnique.mockResolvedValue({
      id: 10,
      titre: "Meditation guidee",
      difficulte: "facile",
    });

    const response = await request(buildApp()).get("/activiteDetente/10");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 10, titre: "Meditation guidee" });
    expect(prismaMock.activiteDetente.findUnique).toHaveBeenCalledWith({
      where: { id: 10 },
    });
  });
});
