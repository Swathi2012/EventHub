import { z } from "zod";

/**
 * EventHub supports only MySQL database URLs.
 *
 * This schema verifies that the value:
 * 1. Is a valid URL.
 * 2. Starts with the MySQL protocol.
 */
const mysqlUrlSchema = z.string().url().startsWith("mysql://");

/**
 * Defines the environment values required by EventHub.
 */
const environmentSchema = z
  .object({
    /**
     * Identifies the current application environment.
     */
    APP_ENV: z.enum(["development", "test", "staging", "production"]),

    /**
     * Public URL used to access EventHub.
     */
    NEXT_PUBLIC_APP_URL: z.string().url(),

    /**
     * Main EventHub application database.
     */
    DATABASE_URL: mysqlUrlSchema,

    /**
     * Separate database used by Prisma migration checks.
     */
    SHADOW_DATABASE_URL: mysqlUrlSchema,
  })
  .refine(
    /**
     * Prisma's shadow database must not be the same as the
     * main EventHub database.
     */
    (environment) =>
      environment.DATABASE_URL !== environment.SHADOW_DATABASE_URL,
    {
      message: "Shadow database must be different from the main database.",
      path: ["SHADOW_DATABASE_URL"],
    },
  );

export type Environment = z.infer<typeof environmentSchema>;

/**
 * Validates environment values before EventHub uses them.
 */
export function parseEnvironment(
  values: Record<string, string | undefined>,
): Environment {
  const result = environmentSchema.safeParse({
    APP_ENV: values.APP_ENV,
    NEXT_PUBLIC_APP_URL: values.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: values.DATABASE_URL,
    SHADOW_DATABASE_URL: values.SHADOW_DATABASE_URL,
  });

  if (!result.success) {
    throw new Error("EventHub environment configuration is invalid.");
  }

  return result.data;
}
