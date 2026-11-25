import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  prisma,
} from "../../../server/db/prisma";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  hashPassword,
  verifyPassword,
} from "../security/password";

import {
  verifyCredentials,
} from "./verify-credentials";

vi.mock(
  "../../../server/db/prisma",
  () => ({
    prisma: {
      user: {
        findUnique: vi.fn(),
      },
    },
  }),
);

vi.mock(
  "../security/password",
  () => ({
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
  }),
);

const findUniqueMock =
  vi.mocked(
    prisma.user.findUnique,
  );

const hashPasswordMock =
  vi.mocked(hashPassword);

const verifyPasswordMock =
  vi.mocked(verifyPassword);

const ACTIVE_USER = {
  id: "user-123",

  name:
    "Swathi Sivanandham",

  email:
    "Swathi@Example.com",

  emailNormalized:
    "swathi@example.com",

  passwordHash:
    "$argon2id$stored-hash",

  role: "USER" as const,

  status: "ACTIVE" as const,

  suspendedAt: null,

  suspendedReason: null,

  createdAt:
    new Date(
      "2026-11-25T00:00:00.000Z",
    ),

  updatedAt:
    new Date(
      "2026-11-25T00:00:00.000Z",
    ),
};

describe(
  "verifyCredentials",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      hashPasswordMock
        .mockResolvedValue(
          "$argon2id$dummy-hash",
        );
    });

    it(
      "normalizes the email before lookup",
      async () => {
        findUniqueMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        verifyPasswordMock
          .mockResolvedValue(true);

        await verifyCredentials({
          email:
            "  SWATHI@EXAMPLE.COM  ",

          password:
            "ValidPassword123!",
        });

        expect(
          findUniqueMock,
        ).toHaveBeenCalledWith({
          where: {
            emailNormalized:
              "swathi@example.com",
          },

          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
          },
        });
      },
    );

    it(
      "returns a safe identity for an active user",
      async () => {
        findUniqueMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        verifyPasswordMock
          .mockResolvedValue(true);

        const result =
          await verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "ValidPassword123!",
          });

        expect(result).toEqual({
          userId: "user-123",

          name:
            "Swathi Sivanandham",

          email:
            "Swathi@Example.com",

          role: "USER",

          status: "ACTIVE",
        });

        expect(result).not.toHaveProperty(
          "password",
        );

        expect(result).not.toHaveProperty(
          "passwordHash",
        );
      },
    );

    it(
      "rejects an incorrect password with a generic error",
      async () => {
        findUniqueMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        verifyPasswordMock
          .mockResolvedValue(false);

        await expect(
          verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "WrongPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .AUTHENTICATION_REQUIRED,

          message:
            "Invalid email or password.",

          statusCode: 401,
        });
      },
    );

    it(
      "rejects an unknown email with the same generic error",
      async () => {
        findUniqueMock
          .mockResolvedValue(null);

        verifyPasswordMock
          .mockResolvedValue(false);

        await expect(
          verifyCredentials({
            email:
              "missing@example.com",

            password:
              "ValidPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .AUTHENTICATION_REQUIRED,

          message:
            "Invalid email or password.",

          statusCode: 401,
        });

        expect(
          verifyPasswordMock,
        ).toHaveBeenCalledWith(
          "$argon2id$dummy-hash",
          "ValidPassword123!",
        );
      },
    );

    it(
      "rejects an account without a password hash",
      async () => {
        findUniqueMock
          .mockResolvedValue({
            ...ACTIVE_USER,
            passwordHash: null,
          });

        verifyPasswordMock
          .mockResolvedValue(false);

        await expect(
          verifyCredentials({
            email:
              "oauth@example.com",

            password:
              "ValidPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .AUTHENTICATION_REQUIRED,

          message:
            "Invalid email or password.",

          statusCode: 401,
        });
      },
    );

    it(
      "blocks a suspended account after password verification",
      async () => {
        findUniqueMock
          .mockResolvedValue({
            ...ACTIVE_USER,
            status:
              "SUSPENDED",
          });

        verifyPasswordMock
          .mockResolvedValue(true);

        await expect(
          verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "ValidPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .ACCOUNT_SUSPENDED,

          message:
            "This account is not available for sign-in.",

          statusCode: 403,
        });

        expect(
          verifyPasswordMock,
        ).toHaveBeenCalledWith(
          "$argon2id$stored-hash",
          "ValidPassword123!",
        );
      },
    );

    it(
      "blocks a disabled account after password verification",
      async () => {
        findUniqueMock
          .mockResolvedValue({
            ...ACTIVE_USER,
            status:
              "DISABLED",
          });

        verifyPasswordMock
          .mockResolvedValue(true);

        await expect(
          verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "ValidPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .ACCOUNT_SUSPENDED,

          message:
            "This account is not available for sign-in.",

          statusCode: 403,
        });
      },
    );

    it(
      "returns a generic credentials error before revealing blocked status when the password is wrong",
      async () => {
        findUniqueMock
          .mockResolvedValue({
            ...ACTIVE_USER,
            status:
              "SUSPENDED",
          });

        verifyPasswordMock
          .mockResolvedValue(false);

        await expect(
          verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "WrongPassword123!",
          }),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .AUTHENTICATION_REQUIRED,

          message:
            "Invalid email or password.",

          statusCode: 401,
        });
      },
    );

    it(
      "does not return the stored password hash",
      async () => {
        findUniqueMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        verifyPasswordMock
          .mockResolvedValue(true);

        const result =
          await verifyCredentials({
            email:
              "swathi@example.com",

            password:
              "ValidPassword123!",
          });

        expect(
          JSON.stringify(result),
        ).not.toContain(
          "$argon2id$stored-hash",
        );
      },
    );
  },
);

