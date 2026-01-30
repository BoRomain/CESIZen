import jwt from "jsonwebtoken";
import { UtilisateurModel } from "./class/UtilisateurModel";
import prisma from "./database";
import "dotenv/config";
import { RefreshTokenModel } from "./class/RefreshTokenModel";

export async function generateRefreshToken(utilisateur: UtilisateurModel) {
  const token = jwt.sign(
    { id: utilisateur.id, role: utilisateur.role },
    process.env["REFRESH_SECRET"] || "",
    {
      expiresIn: "7d",
    },
  );
  const refreshToken: RefreshTokenModel = await prisma.refreshToken.create({
    data: {
      utilisateurId: utilisateur.id,
      token: token,
    },
  });

  return refreshToken;
}

export async function generateAccessToken(
  utilisateur: UtilisateurModel,
  refreshToken: string,
) {
  jwt.verify(refreshToken, process.env["REFRESH_SECRET"] || "");
  await prisma.refreshToken.findFirstOrThrow({
    where: {
      utilisateurId: utilisateur.id,
      token: refreshToken,
    },
  });
  const accessToken = jwt.sign(
    { id: utilisateur.id, role: utilisateur.role },
    process.env["ACCESS_SECRET"] || "",
    {
      expiresIn: "15m",
    },
  );
  return accessToken;
}
