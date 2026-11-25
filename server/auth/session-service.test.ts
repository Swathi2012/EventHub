import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  prisma,
} from "../db/prisma";

import {
  createSession,
} from "./create-session";

import {
  deleteSession,
} from "./delete-session";

import {
  readSession,
} from "./read-session";

vi.mock(
  "../db/prisma",
  () => ({
    prisma: {
      session: {
        create: vi.fn(),
        findUnique: vi.fn(),
        deleteMany: vi.fn(),
      },
    },
  }),
);

const sessionCreateMock =
  vi.mocked(
    prisma.session.create,
  );

const sessionFindMock =
  vi.mocked(
    prisma.session.findUnique,
  );

const sessionDeleteMock =
  vi.mocked(
    prisma.session.deleteMany,
  );

describe(
  "database session service",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      sessionCreateMock
        .mockResolvedValue({
          id: "session-123",
        } as never);

      sessionDeleteMock
        .mockResolvedValue({
          count: 1,
        });
    });

    it(
      "stores a digest instead of the raw session token",
      async () => {
        const result =
          await createSession(
            "user-123",
          );

        expect(
          sessionCreateMock,
        ).toHaveBeenCalledOnce();

        const createInput =
          sessionCreateMock.mock
            .calls[0]?.[0];

        const storedToken =
          createInput?.data
            .sessionToken;

        expect(
          storedToken,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          storedToken,
        ).not.toBe(
          result.sessionToken,
        );
      },
    );

    it(
      "returns an active session user",
      async () => {
        sessionFindMock
          .mockResolvedValue({
            expires:
              new Date(
                Date.now() +
                  60_000,
              ),

            user: {
              id: "user-123",
              name: "Test User",
              email:
                "test@example.com",
              role: "USER",
              status: "ACTIVE",
            },
          } as never);

        const result =
          await readSession(
            "raw-session-token",
          );

        expect(result).toEqual({
          userId: "user-123",

          name: "Test User",

          email:
            "test@example.com",

          role: "USER",

          status: "ACTIVE",

          expires:
            expect.any(Date),
        });
      },
    );

    it(
      "returns null when a session does not exist",
      async () => {
        sessionFindMock
          .mockResolvedValue(
            null,
          );

        await expect(
          readSession(
            "missing-session-token",
          ),
        ).resolves.toBeNull();

        expect(
          sessionDeleteMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects an expired session and deletes it",
      async () => {
        sessionFindMock
          .mockResolvedValue({
            expires:
              new Date(
                Date.now() -
                  60_000,
              ),

            user: {
              id: "user-123",
              name: "Test User",
              email:
                "test@example.com",
              role: "USER",
              status: "ACTIVE",
            },
          } as never);

        await expect(
          readSession(
            "expired-token",
          ),
        ).resolves.toBeNull();

        expect(
          sessionDeleteMock,
        ).toHaveBeenCalledOnce();
      },
    );

    it(
      "rejects a suspended session user",
      async () => {
        sessionFindMock
          .mockResolvedValue({
            expires:
              new Date(
                Date.now() +
                  60_000,
              ),

            user: {
              id: "user-123",
              name: "Test User",
              email:
                "test@example.com",
              role: "USER",
              status:
                "SUSPENDED",
            },
          } as never);

        await expect(
          readSession(
            "suspended-token",
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "rejects a disabled session user",
      async () => {
        sessionFindMock
          .mockResolvedValue({
            expires:
              new Date(
                Date.now() +
                  60_000,
              ),

            user: {
              id: "user-123",
              name: "Test User",
              email:
                "test@example.com",
              role: "USER",
              status:
                "DISABLED",
            },
          } as never);

        await expect(
          readSession(
            "disabled-token",
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "deletes a session using its digest",
      async () => {
        await deleteSession(
          "raw-session-token",
        );

        const deleteInput =
          sessionDeleteMock.mock
            .calls[0]?.[0];

        const storedSessionToken =
          deleteInput?.where
            ?.sessionToken;

        if (
          typeof storedSessionToken !==
          "string"
        ) {
          throw new Error(
            "Expected deleteSession to use a session-token digest.",
          );
        }

        expect(
          storedSessionToken,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          storedSessionToken,
        ).not.toBe(
          "raw-session-token",
        );
      },
    );
  },
);
