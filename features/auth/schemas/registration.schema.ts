import { z } from "zod";

import type {
  FieldErrors,
} from "../../../server/errors/application-error";

export const REGISTRATION_LIMITS = {
  NAME_MINIMUM: 2,
  NAME_MAXIMUM: 100,
  EMAIL_MAXIMUM: 191,
  PASSWORD_MINIMUM: 12,
  PASSWORD_MAXIMUM: 128,
} as const;

export const registrationSchema = z
  .object({
    name: z
      .string({
        error:
          "Name is required.",
      })
      .trim()
      .min(
        REGISTRATION_LIMITS.NAME_MINIMUM,
        {
          error:
            "Name must contain at least 2 characters.",
        },
      )
      .max(
        REGISTRATION_LIMITS.NAME_MAXIMUM,
        {
          error:
            "Name must contain no more than 100 characters.",
        },
      ),

    email: z
      .string({
        error:
          "Email address is required.",
      })
      .trim()
      .min(1, {
        error:
          "Email address is required.",
      })
      .max(
        REGISTRATION_LIMITS.EMAIL_MAXIMUM,
        {
          error:
            "Email address is too long.",
        },
      )
      .email({
        error:
          "Enter a valid email address.",
      }),

    password: z
      .string({
        error:
          "Password is required.",
      })
      .min(
        REGISTRATION_LIMITS.PASSWORD_MINIMUM,
        {
          error:
            "Password must contain at least 12 characters.",
        },
      )
      .max(
        REGISTRATION_LIMITS.PASSWORD_MAXIMUM,
        {
          error:
            "Password must contain no more than 128 characters.",
        },
      ),

    confirmPassword: z
      .string({
        error:
          "Password confirmation is required.",
      })
      .min(1, {
        error:
          "Password confirmation is required.",
      }),
  })
  .strict()
  .refine(
    (values) =>
      values.password ===
      values.confirmPassword,
    {
      path: [
        "confirmPassword",
      ],

      message:
        "Passwords do not match.",
    },
  );

export type RegistrationInput =
  z.infer<
    typeof registrationSchema
  >;

export function formatRegistrationFieldErrors(
  error: z.ZodError,
): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field =
      issue.path.length > 0
        ? String(issue.path[0])
        : "_form";

    const existingMessages =
      fieldErrors[field] ?? [];

    fieldErrors[field] = [
      ...existingMessages,
      issue.message,
    ];
  }

  return fieldErrors;
}
