import "server-only";

import {
  ApplicationError,
} from "../errors/application-error";

import {
  ERROR_CODES,
} from "../errors/error-codes";

import {
  currentUser,
} from "./current-user";

import type {
  SessionUser,
} from "./read-session";

const AUTHENTICATION_REQUIRED_MESSAGE =
  "You must sign in to continue.";

export async function requireUser():
  Promise<SessionUser> {
  const user =
    await currentUser();

  if (!user) {
    throw new ApplicationError({
      code:
        ERROR_CODES
          .AUTHENTICATION_REQUIRED,

      message:
        AUTHENTICATION_REQUIRED_MESSAGE,

      statusCode: 401,
    });
  }

  return user;
}
