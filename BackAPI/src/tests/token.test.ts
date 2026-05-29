import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";

describe("token utils", () => {
  it("génère un token", () => {
    const token = generateAccessToken(1, "admin");
    expect(token).not.toBeUndefined();
  });

  it("vérifie un access token", () => {
    const token = generateAccessToken(1, "admin");
    const payload = verifyAccessToken(token);
    if (payload) {
      expect(payload.id).toBe(1);
      expect(payload.role).toBe("admin");
    }
  });

  it("vérifie un refresh token", () => {
    const token = generateRefreshToken(1, "admin");
    const payload = verifyRefreshToken(token);
    if (payload) {
      expect(payload.id).toBe(1);
      expect(payload.role).toBe("admin");
    }
  });

  it("retourne false si le token est mauvais", () => {
    const token = generateAccessToken(1, "admin");
    const payload = verifyAccessToken(token + "1");
    expect(payload).toBeUndefined();
  });
});
