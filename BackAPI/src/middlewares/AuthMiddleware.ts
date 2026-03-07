import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

const ACCESS_SECRET = process.env["ACCESS_SECRET"] || "";
const REFRESH_SECRET = process.env["REFRESH_SECRET"] || "";

export async function authWithRefresh(req: any, res: Response, next: NextFunction) {
  const token = req.token; // On suppose que le token est déjà extrait (via un middleware précédent)

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // 1. Tenter de vérifier l'Access Token
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    // 2. Si l'erreur est une expiration, on tente le Refresh
    if (error instanceof TokenExpiredError) {
      const refreshToken = req.cookies?.refreshToken; // Utilisation recommandée des cookies

      if (!refreshToken) {
        return res
          .status(401)
          .json({ error: "Access expired and no refresh token found" });
      }

      try {
        // 3. Vérifier le Refresh Token
        const refreshDecoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;

        // 4. Générer un nouvel Access Token
        const newAccessToken = jwt.sign(
          { id: refreshDecoded.id, role: refreshDecoded.role },
          ACCESS_SECRET,
          { expiresIn: "15m" },
        );

        // 5. Envoyer le nouveau token au client via un header personnalisé
        res.setHeader("x-new-access-token", newAccessToken);

        // Injecter l'utilisateur dans la requête pour la suite
        req.user = refreshDecoded;
        return next();
      } catch (refreshErr) {
        return res.status(401).json({ error: "Session expired, please login again" });
      }
    }

    return res.status(401).json({ error: "Invalid token" });
  }
}
