import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import prisma from "../src/database.js";

const DEMO_USERS_COUNT = 10;
const DEMO_INFOS_COUNT = 10;
const DEMO_ACTIVITIES_COUNT = 10;

async function main() {
  console.log(`Start seeding ...`);
  console.log(`Postgres: ${process.env["DATABASE_URL"]}`);
  const rootHashedPassword = await bcrypt.hash("root", 10);
  const rootUser = await prisma.utilisateur.upsert({
    where: { email: "root" },
    update: {
      nom: "root",
      prenom: "root",
      motDePasse: rootHashedPassword,
      role: "admin",
      status: true,
    },
    create: {
      nom: "root",
      prenom: "root",
      email: "root",
      motDePasse: rootHashedPassword,
      role: "admin",
      status: true,
    },
  });
  console.log(`Root user ready (id: ${rootUser.id})`);

  for (let i = 1; i <= DEMO_USERS_COUNT; i++) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const email = `demo-user-${i}@cesizen.local`;
    const user = await prisma.utilisateur.upsert({
      where: { email },
      update: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        motDePasse: hashedPassword,
        role: faker.helpers.arrayElement(["user", "admin"]),
        status: faker.datatype.boolean(),
      },
      create: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email,
        motDePasse: hashedPassword,
        role: faker.helpers.arrayElement(["user", "admin"]),
        status: faker.datatype.boolean(),
      },
    });
    console.log(`User ready: ${user.email}`);
  }

  const infoCount = await prisma.information.count();
  if (infoCount === 0) {
    for (let i = 0; i < DEMO_INFOS_COUNT; i++) {
      const info = await prisma.information.create({
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
      console.log(`Created info with id: ${info.id}`);
    }
  } else {
    console.log(`Information already seeded (${infoCount} rows), skipping.`);
  }

  const activityCount = await prisma.activiteDetente.count();
  if (activityCount === 0) {
    for (let i = 0; i < DEMO_ACTIVITIES_COUNT; i++) {
      const activity = await prisma.activiteDetente.create({
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
      console.log(`Created activity with id: ${activity.id}`);
    }
  } else {
    console.log(`Activities already seeded (${activityCount} rows), skipping.`);
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
