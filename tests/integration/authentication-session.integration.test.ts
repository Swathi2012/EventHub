import {
  randomUUID,
} from "node:crypto";

import {
  afterAll,
  describe,
  expect,
  it,
} from "vitest";

import {
  registerUser,
} from "../../features/auth/services/register-user";

import {
  verifyCredentials,
} from "../../features/auth/services/verify-credentials";

import {
  createSession,
} from "../../server/auth/create-session";

import {
  deleteSession,
} from "../../server/auth/delete-session";

import {
  readSession,
} from "../../server/auth/read-session";

import {
  hashSessionToken,
} from "../../server/auth/session-token";

import {
  prisma,
} from "../../server/db/prisma";

describe(
  "authentication database session",
  () => {
    const createdUserIds:
      string[] = [];

    const createdSessionDigests:
      string[] = [];

    afterAll(async () => {
      if (
        createdSessionDigests
          .length > 0
      ) {
        await prisma.session
          .deleteMany({
            where: {
              sessionToken: {
                in:
                  createdSessionDigests,
              },
            },
          });
      }

      if (
        createdUserIds.length >
        0
      ) {
        await prisma.user
          .deleteMany({
            where: {
              id: {
                in:
                  createdUserIds,
              },
            },
          });
      }

      await prisma.$disconnect();
    });

    it(
      "verifies credentials and creates a revocable database session",
      async () => {
        const email =
          `auth-${randomUUID()}@example.com`;

        const plainPassword =
          "ValidPassword123!";

        const registeredUser =
          await registerUser({
            name:
              "Authentication User",

            email,

            password:
              plainPassword,
          });

        createdUserIds.push(
          registeredUser.userId,
        );

        const identity =
          await verifyCredentials({
            email:
              email.toUpperCase(),

            password:
              plainPassword,
          });

        expect(identity).toEqual(
          expect.objectContaining({
            userId:
              registeredUser.userId,

            role: "USER",

            status: "ACTIVE",
          }),
        );

        expect(identity).not
          .toHaveProperty(
            "passwordHash",
          );

        const session =
          await createSession(
            identity.userId,
          );

        const digest =
          hashSessionToken(
            session.sessionToken,
          );

        createdSessionDigests.push(
          digest,
        );

        const storedSession =
          await prisma.session
            .findUnique({
              where: {
                sessionToken:
                  digest,
              },
            });

        expect(
          storedSession,
        ).not.toBeNull();

        expect(
          storedSession
            ?.sessionToken,
        ).not.toBe(
          session.sessionToken,
        );

        const sessionUser =
          await readSession(
            session.sessionToken,
          );

        expect(
          sessionUser,
        ).toEqual(
          expect.objectContaining({
            userId:
              registeredUser.userId,

            email,

            status: "ACTIVE",
          }),
        );

        await deleteSession(
          session.sessionToken,
        );

        const deletedSession =
          await prisma.session
            .findUnique({
              where: {
                sessionToken:
                  digest,
              },
            });

        expect(
          deletedSession,
        ).toBeNull();

        await expect(
          readSession(
            session.sessionToken,
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "rejects an invalid password with a generic error",
      async () => {
        const email =
          `wrong-password-${randomUUID()}@example.com`;

        const registeredUser =
          await registerUser({
            name:
              "Wrong Password User",

            email,

            password:
              "ValidPassword123!",
          });

        createdUserIds.push(
          registeredUser.userId,
        );

        await expect(
          verifyCredentials({
            email,

            password:
              "WrongPassword123!",
          }),
        ).rejects.toMatchObject({
          message:
            "Invalid email or password.",

          statusCode: 401,
        });
      },
    );

    it(
      "rejects an unknown email with the same generic error",
      async () => {
        await expect(
          verifyCredentials({
            email:
              `missing-${randomUUID()}@example.com`,

            password:
              "ValidPassword123!",
          }),
        ).rejects.toMatchObject({
          message:
            "Invalid email or password.",

          statusCode: 401,
        });
      },
    );

    it(
      "invalidates an existing session when the account becomes suspended",
      async () => {
        const email =
          `suspended-${randomUUID()}@example.com`;

        const registeredUser =
          await registerUser({
            name:
              "Suspended User",

            email,

            password:
              "ValidPassword123!",
          });

        createdUserIds.push(
          registeredUser.userId,
        );

        const session =
          await createSession(
            registeredUser.userId,
          );

        const digest =
          hashSessionToken(
            session.sessionToken,
          );

        createdSessionDigests.push(
          digest,
        );

        await prisma.user.update({
          where: {
            id:
              registeredUser.userId,
          },

          data: {
            status:
              "SUSPENDED",
          },
        });

        await expect(
          readSession(
            session.sessionToken,
          ),
        ).resolves.toBeNull();
      },
    );
  },
);
