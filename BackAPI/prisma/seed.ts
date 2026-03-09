import prisma from "../src/database.js";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

async function main() {
  console.log(`Start seeding ...`);
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await prisma.utilisateur.create({
      data: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email: faker.internet.email(),
        motDePasse: hashedPassword,
        role: faker.helpers.arrayElement(["user", "admin"]),
        status: faker.datatype.boolean(),
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
