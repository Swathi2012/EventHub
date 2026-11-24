import "server-only";

import {
  withDatabaseErrorHandling,
} from "../../../server/db/database-error";

import {
  prisma,
} from "../../../server/db/prisma";

import {
  isEmailNormalizedConflict,
} from "../../../server/db/prisma-error";

import {
  ApplicationError,
} from "../../../server/errors/application-error";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  normalizeEmail,
} from "../security/email-normalization";

import {
  hashPassword,
} from "../security/password";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisteredUser = {
  userId: string;
  name: string;
  email: string;
};

const DUPLICATE_EMAIL_MESSAGE =
  "An account with this email address already exists.";

function createDuplicateEmailError():
  ApplicationError {
  return new ApplicationError({
    code: ERROR_CODES.CONFLICT,

    message:
      DUPLICATE_EMAIL_MESSAGE,

    statusCode: 409,
  });
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<RegisteredUser> {
  const name =
    input.name.trim();

  const email =
    input.email.trim();

  const emailNormalized =
    normalizeEmail(input.email);

  const existingUser =
    await withDatabaseErrorHandling(
      {
        operation:
          "check-registration-email",
      },
      () =>
        prisma.user.findUnique({
          where: {
            emailNormalized,
          },

          select: {
            id: true,
          },
        }),
    );

  if (existingUser) {
    throw createDuplicateEmailError();
  }

  const passwordHash =
    await hashPassword(
      input.password,
    );

  const user =
    await withDatabaseErrorHandling(
      {
        operation:
          "register-user",
      },
      async () => {
        try {
          return await prisma.user.create({
            data: {
              name,
              email,
              emailNormalized,
              passwordHash,
            },

            select: {
              id: true,
              name: true,
              email: true,
            },
          });
        } catch (error) {
          if (
            isEmailNormalizedConflict(
              error,
            )
          ) {
            throw createDuplicateEmailError();
          }

          throw error;
        }
      },
    );

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
  };
}
