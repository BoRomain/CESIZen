import prisma from "../src/database.js";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

async function main() {
  console.log(`Start seeding ...`);
  const rootUser = await prisma.utilisateur.create({
    data: {
      nom: "root",
      prenom: "root",
      email: "root",
      motDePasse: await bcrypt.hash("root", 10),
      role: "admin",
      status: true,
    },
  });
  console.log(`Created root user`);
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await prisma.information.create({
      data: {
        titre: faker.lorem.words(),
        description: faker.lorem.words(),
        texte: faker.lorem.words(),
        image: faker.image.url(),
        categorie: faker.helpers.arrayElement(["Sport", "Culture", "Santé"]),
        status: faker.datatype.boolean(),
        authorId: rootUser.id,
      },
    });
    console.log(`Created info with id: ${user.id}`);
  }
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user = await prisma.activiteDetente.create({
      data: {
        titre: faker.lorem.words(),
        description: faker.lorem.words(),
        image: faker.image.url(),
        type: faker.helpers.arrayElement(["Sport", "Culture", "Santé"]),
        status: faker.datatype.boolean(),
        difficulte: faker.number.int({ min: 1, max: 5 }),
        duree: faker.number.int({ min: 1, max: 5 }),
        lieu: faker.helpers.arrayElement(["Maison", "Publique", "Gym"]),
        authorId: rootUser.id,
      },
    });
    console.log(`Created activity with id: ${user.id}`);
  }
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("123456", 10);
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
