import { config } from "dotenv";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

import { parseDatabaseUrl } from "../server/db/database-url";
import { seedEventCategories } from "./seed-categories";

config({
  path: ".env.local",
});

function createSeedClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to seed EventHub.");
  }

  const connection = parseDatabaseUrl(databaseUrl);

  const adapter = new PrismaMariaDb({
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database,
    connectionLimit: 2,
  });

  return new PrismaClient({
    adapter,
  });
}

const prisma = createSeedClient();

async function main(): Promise<void> {
  console.log("Seeding EventHub categories...");

  await seedEventCategories(prisma);

  console.log("EventHub categories seeded successfully.");
}

main()
  .catch((error: unknown) => {
    console.error("EventHub seed failed:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
