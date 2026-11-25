import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ERROR_CODES,
} from "../errors/error-codes";

import {
  currentUser,
} from "./current-user";

import {
  requireActiveUser,
} from "./require-active-user";

import {
  requireUser,
} from "./require-user";

vi.mock(
  "./current-user",
  () => ({
    currentUser:
      vi.fn(),
  }),
);

const currentUserMock =
  vi.mocked(
    currentUser,
  );

const ACTIVE_USER = {
  userId: "user-123",
  name: "Test User",
  email:
    "test@example.com",
  role: "USER" as const,
  status: "ACTIVE" as const,

  expires:
    new Date(
      "2026-12-02T00:00:00.000Z",
    ),
};

describe(
  "required-user helpers",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "returns the authenticated user",
      async () => {
        currentUserMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        await expect(
          requireUser(),
        ).resolves.toEqual(
          ACTIVE_USER,
        );
      },
    );

    it(
      "rejects an unauthenticated request",
      async () => {
        currentUserMock
          .mockResolvedValue(null);

        await expect(
          requireUser(),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .AUTHENTICATION_REQUIRED,

          message:
            "You must sign in to continue.",

          statusCode: 401,
        });
      },
    );

    it(
      "allows an active user",
      async () => {
        currentUserMock
          .mockResolvedValue(
            ACTIVE_USER,
          );

        await expect(
          requireActiveUser(),
        ).resolves.toEqual(
          ACTIVE_USER,
        );
      },
    );

    it(
      "blocks a suspended user",
      async () => {
        currentUserMock
          .mockResolvedValue({
            ...ACTIVE_USER,

            status:
              "SUSPENDED",
          });

        await expect(
          requireActiveUser(),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .ACCOUNT_SUSPENDED,

          statusCode: 403,
        });
      },
    );

    it(
      "blocks a disabled user",
      async () => {
        currentUserMock
          .mockResolvedValue({
            ...ACTIVE_USER,

            status:
              "DISABLED",
          });

        await expect(
          requireActiveUser(),
        ).rejects.toMatchObject({
          code:
            ERROR_CODES
              .ACCOUNT_SUSPENDED,

          statusCode: 403,
        });
      },
    );
  },
);
