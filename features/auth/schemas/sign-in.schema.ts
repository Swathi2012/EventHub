import {
  z,
} from "zod";

import type {
  FieldErrors,
} from "../../../server/errors/application-error";

export const SIGN_IN_LIMITS = {
  EMAIL_MAXIMUM: 191,
  PASSWORD_MAXIMUM: 128,
} as const;

export const signInSchema = z
  .object({
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
        SIGN_IN_LIMITS.EMAIL_MAXIMUM,
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
      .min(1, {
        error:
          "Password is required.",
      })
      .max(
        SIGN_IN_LIMITS.PASSWORD_MAXIMUM,
        {
          error:
            "Password is too long.",
        },
      ),
  })
  .strict();

export type SignInInput =
  z.infer<
    typeof signInSchema
  >;

export function formatSignInFieldErrors(
  error: z.ZodError,
): FieldErrors {
  const fieldErrors:
    FieldErrors = {};

  for (
    const issue of error.issues
  ) {
    const field =
      issue.path.length > 0
        ? String(
            issue.path[0],
          )
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
