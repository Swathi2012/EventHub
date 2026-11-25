import "server-only";

import type {
  AccountStatus,
  UserRole,
} from "../../../generated/prisma/client";

import {
  withDatabaseErrorHandling,
} from "../../../server/db/database-error";

import {
  prisma,
} from "../../../server/db/prisma";

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
  verifyPassword,
} from "../security/password";

export type VerifyCredentialsInput = {
  email: string;
  password: string;
};

export type AuthenticatedIdentity = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
};

const INVALID_CREDENTIALS_MESSAGE =
  "Invalid email or password.";

const ACCOUNT_UNAVAILABLE_MESSAGE =
  "This account is not available for sign-in.";

let dummyPasswordHashPromise:
  Promise<string> | undefined;

function getDummyPasswordHash():
  Promise<string> {
  dummyPasswordHashPromise ??=
    hashPassword(
      "EventHub-Dummy-Credential-Value",
    );

  return dummyPasswordHashPromise;
}

function createInvalidCredentialsError():
  ApplicationError {
  return new ApplicationError({
    code:
      ERROR_CODES
        .AUTHENTICATION_REQUIRED,

    message:
      INVALID_CREDENTIALS_MESSAGE,

    statusCode: 401,
  });
}

function createAccountUnavailableError():
  ApplicationError {
  return new ApplicationError({
    code:
      ERROR_CODES.ACCOUNT_SUSPENDED,

    message:
      ACCOUNT_UNAVAILABLE_MESSAGE,

    statusCode: 403,
  });
}

export async function verifyCredentials(
  input: VerifyCredentialsInput,
): Promise<AuthenticatedIdentity> {
  const emailNormalized =
    normalizeEmail(input.email);

  const user =
    await withDatabaseErrorHandling(
      {
        operation:
          "find-user-for-authentication",
      },
      () =>
        prisma.user.findUnique({
          where: {
            emailNormalized,
          },

          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
          },
        }),
    );

  if (!user?.passwordHash) {
    const dummyPasswordHash =
      await getDummyPasswordHash();

    await verifyPassword(
      dummyPasswordHash,
      input.password,
    );

    throw createInvalidCredentialsError();
  }

  const passwordMatches =
    await verifyPassword(
      user.passwordHash,
      input.password,
    );

  if (!passwordMatches) {
    throw createInvalidCredentialsError();
  }

  if (user.status !== "ACTIVE") {
    throw createAccountUnavailableError();
  }

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}
