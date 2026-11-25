import "server-only";

import {
  withDatabaseErrorHandling,
} from "../db/database-error";

import {
  prisma,
} from "../db/prisma";

import {
  hashSessionToken,
} from "./session-token";

export async function deleteSession(
  sessionToken: string,
): Promise<void> {
  const tokenDigest =
    hashSessionToken(
      sessionToken,
    );

  await withDatabaseErrorHandling(
    {
      operation:
        "delete-authentication-session",
    },
    () =>
      prisma.session.deleteMany({
        where: {
          sessionToken:
            tokenDigest,
        },
      }),
  );
}
