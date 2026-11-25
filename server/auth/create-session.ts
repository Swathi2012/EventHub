import "server-only";

import {
  withDatabaseErrorHandling,
} from "../db/database-error";

import {
  prisma,
} from "../db/prisma";

import {
  createSessionExpiry,
  createSessionToken,
  hashSessionToken,
} from "./session-token";

export type CreateSessionResult = {
  sessionToken: string;
  expires: Date;
};

export async function createSession(
  userId: string,
): Promise<CreateSessionResult> {
  const sessionToken =
    createSessionToken();

  const tokenDigest =
    hashSessionToken(
      sessionToken,
    );

  const expires =
    createSessionExpiry();

  await withDatabaseErrorHandling(
    {
      operation:
        "create-authentication-session",
    },
    () =>
      prisma.session.create({
        data: {
          sessionToken:
            tokenDigest,

          userId,
          expires,
        },

        select: {
          id: true,
        },
      }),
  );

  return {
    sessionToken,
    expires,
  };
}
