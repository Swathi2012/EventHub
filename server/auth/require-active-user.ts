import "server-only";

import {
  ApplicationError,
} from "../errors/application-error";

import {
  ERROR_CODES,
} from "../errors/error-codes";

import {
  requireUser,
} from "./require-user";

import type {
  SessionUser,
} from "./read-session";

const ACCOUNT_UNAVAILABLE_MESSAGE =
  "This account is not available.";

export async function requireActiveUser():
  Promise<SessionUser> {
  const user =
    await requireUser();

  if (
    user.status !== "ACTIVE"
  ) {
    throw new ApplicationError({
      code:
        ERROR_CODES
          .ACCOUNT_SUSPENDED,

      message:
        ACCOUNT_UNAVAILABLE_MESSAGE,

      statusCode: 403,
    });
  }

  return user;
}
