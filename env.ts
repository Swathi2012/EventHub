import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "test", "staging", "production"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function parseEnvironment(
  values: Record<string, string | undefined>,
): Environment {
  const result = environmentSchema.safeParse({
    APP_ENV: values.APP_ENV,
    NEXT_PUBLIC_APP_URL: values.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    throw new Error("EventHub environment configuration is invalid.");
  }

  return result.data;
}
