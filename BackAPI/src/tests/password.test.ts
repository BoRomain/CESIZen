import { comparePassword, hashPassword } from "../utils/password.js";

describe("password utils", () => {
  it("Hash le password et le compare", async () => {
    const plainPassword = "UnitTest123!";
    const hashed = await hashPassword(plainPassword);

    expect(hashed).not.toBe(plainPassword);
    await expect(comparePassword(plainPassword, hashed)).resolves.toBe(true);
  });

  it("retourne false si le password est mauvais", async () => {
    const hashed = await hashPassword("CorrectPassword123!");

    await expect(comparePassword("WrongPassword123!", hashed)).resolves.toBe(false);
  });
});
