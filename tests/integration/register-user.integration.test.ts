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
  verifyPassword,
} from "../../features/auth/security/password";

import {
  prisma,
} from "../../server/db/prisma";

function createTestEmail(): string {
  return [
    "registration",
    randomUUID(),
    "@example.com",
  ].join("");
}

describe(
  "user registration service",
  () => {
    const createdUserIds:
      string[] = [];

    afterAll(async () => {
      if (
        createdUserIds.length > 0
      ) {
        await prisma.user.deleteMany({
          where: {
            id: {
              in: createdUserIds,
            },
          },
        });
      }

      await prisma.$disconnect();
    });

    it(
      "creates a user with normalized identity and secure defaults",
      async () => {
        const testEmail =
          createTestEmail();

        const displayEmail =
          `  ${testEmail.toUpperCase()}  `;

        const plainPassword =
          "ValidPassword123!";

        const result =
          await registerUser({
            name:
              "  Registration User  ",

            email:
              displayEmail,

            password:
              plainPassword,
          });

        createdUserIds.push(
          result.userId,
        );

        expect(result).toEqual({
          userId:
            expect.any(String),

          name:
            "Registration User",

          email:
            testEmail.toUpperCase(),
        });

        const storedUser =
          await prisma.user.findUnique({
            where: {
              id: result.userId,
            },
          });

        expect(storedUser).not.toBeNull();

        if (!storedUser) {
          throw new Error(
            "Expected the registered user to exist.",
          );
        }

        expect(storedUser.name).toBe(
          "Registration User",
        );

        expect(storedUser.email).toBe(
          testEmail.toUpperCase(),
        );

        expect(
          storedUser.emailNormalized,
        ).toBe(
          testEmail.toLowerCase(),
        );

        expect(storedUser.role).toBe(
          "USER",
        );

        expect(storedUser.status).toBe(
          "ACTIVE",
        );

        expect(
          storedUser.passwordHash,
        ).not.toBeNull();

        expect(
          storedUser.passwordHash,
        ).not.toBe(
          plainPassword,
        );

        expect(
          storedUser.passwordHash,
        ).not.toContain(
          plainPassword,
        );

        const passwordMatches =
          await verifyPassword(
            storedUser.passwordHash ?? "",
            plainPassword,
          );

        expect(passwordMatches).toBe(
          true,
        );
      },
    );

    it(
      "returns only safe user data",
      async () => {
        const testEmail =
          createTestEmail();

        const result =
          await registerUser({
            name: "Safe Result User",
            email: testEmail,
            password:
              "ValidPassword123!",
          });

        createdUserIds.push(
          result.userId,
        );

        expect(result).toEqual({
          userId:
            expect.any(String),

          name:
            "Safe Result User",

          email:
            testEmail,
        });

        expect(result).not.toHaveProperty(
          "password",
        );

        expect(result).not.toHaveProperty(
          "confirmPassword",
        );

        expect(result).not.toHaveProperty(
          "passwordHash",
        );

        expect(result).not.toHaveProperty(
          "emailNormalized",
        );

        expect(result).not.toHaveProperty(
          "role",
        );

        expect(result).not.toHaveProperty(
          "status",
        );
      },
    );

    it(
      "does not create a user when password hashing fails before persistence",
      async () => {
        const testEmail =
          createTestEmail();

        await expect(
          registerUser({
            name:
              "Invalid Password User",

            email:
              testEmail,

            password:
              "",
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            userId:
              expect.any(String),
          }),
        );

        const createdUser =
          await prisma.user.findUnique({
            where: {
              emailNormalized:
                testEmail.toLowerCase(),
            },
          });

        if (createdUser) {
          createdUserIds.push(
            createdUser.id,
          );
        }
      },
    );
  },
);
