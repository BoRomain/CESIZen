import express from "express";
import request from "supertest";

jest.mock("../database.js", () => ({
  __esModule: true,
  default: {
    information: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "../database.js";
import informationRouter from "../routes/Information.js";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/information", informationRouter);
  return app;
};

describe("Information routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /information returns filtered and paginated results", async () => {
    const prismaMock = prisma as any;
    prismaMock.information.findMany.mockResolvedValue([
      { id: 1, titre: "Stress", categorie: "Wellbeing" },
    ]);

    const response = await request(buildApp()).get(
      "/information?titre=str&categorie=well&page=2&limit=5",
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(prismaMock.information.findMany).toHaveBeenCalledWith({
      where: {
        titre: { contains: "str", mode: "insensitive" },
        categorie: { contains: "well", mode: "insensitive" },
      },
      skip: 5,
      take: 5,
      orderBy: { dateModification: "desc" },
    });
  });

  it("GET /information/categories returns category names only", async () => {
    const prismaMock = prisma as any;
    prismaMock.information.findMany.mockResolvedValue([
      { categorie: "Wellbeing", status: true },
      { categorie: "Nutrition", status: true },
    ]);

    const response = await request(buildApp()).get("/information/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(["Wellbeing", "Nutrition"]);
  });

  it("GET /information/:id returns one information item", async () => {
    const prismaMock = prisma as any;
    prismaMock.information.findUnique.mockResolvedValue({
      id: 10,
      titre: "Hydration",
      categorie: "Health",
    });

    const response = await request(buildApp()).get("/information/10");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 10, titre: "Hydration" });
    expect(prismaMock.information.findUnique).toHaveBeenCalledWith({
      where: { id: 10 },
    });
  });
});
