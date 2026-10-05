import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma commands run outside the normal Next.js environment loader.
 *
 * EventHub stores private local configuration in `.env.local`,
 * so Prisma loads that file explicitly.
 */
config({
  path: ".env.local",
});

export default defineConfig({
  /**
   * Location of the Prisma schema.
   */
  schema: "prisma/schema.prisma",

  /**
   * Migration files and the explicit database seed command.
   */
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  /**
   * Read the required MySQL connection string.
   *
   * `env()` returns a required string and reports a clear
   * Prisma configuration error when DATABASE_URL is missing.
   */
  datasource: {
  url: env("DATABASE_URL"),
  shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
},
});