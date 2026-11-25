import "server-only";

import type {
  AccountStatus,
  UserRole,
} from "../../generated/prisma/client";

import {
  withDatabaseErrorHandling,
} from "../db/database-error";

import {
  prisma,
} from "../db/prisma";

import {
  hashSessionToken,
} from "./session-token";

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  expires: Date;
};

export async function readSession(
  sessionToken: string,
): Promise<SessionUser | null> {
  const tokenDigest =
    hashSessionToken(
      sessionToken,
    );

  const session =
    await withDatabaseErrorHandling(
      {
        operation:
          "read-authentication-session",
      },
      () =>
        prisma.session.findUnique({
          where: {
            sessionToken:
              tokenDigest,
          },

          select: {
            expires: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
              },
            },
          },
        }),
    );

  if (!session) {
    return null;
  }

  if (
    session.expires.getTime() <=
    Date.now()
  ) {
    await withDatabaseErrorHandling(
      {
        operation:
          "delete-expired-session",
      },
      () =>
        prisma.session.deleteMany({
          where: {
            sessionToken:
              tokenDigest,
          },
        }),
    );

    return null;
  }

  if (
    session.user.status !==
    "ACTIVE"
  ) {
    return null;
  }

  return {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    status: session.user.status,
    expires: session.expires,
  };
}
