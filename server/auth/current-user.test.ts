import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getSessionCookie,
} from "./session-cookie";

import {
  readSession,
} from "./read-session";

import {
  currentUser,
} from "./current-user";

vi.mock(
  "./session-cookie",
  () => ({
    getSessionCookie:
      vi.fn(),
  }),
);

vi.mock(
  "./read-session",
  () => ({
    readSession:
      vi.fn(),
  }),
);

const getSessionCookieMock =
  vi.mocked(
    getSessionCookie,
  );

const readSessionMock =
  vi.mocked(
    readSession,
  );

describe(
  "currentUser",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "returns null when the session cookie is missing",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(null);

        await expect(
          currentUser(),
        ).resolves.toBeNull();

        expect(
          readSessionMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns null when the database session is invalid",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(
            "raw-session-token",
          );

        readSessionMock
          .mockResolvedValue(null);

        await expect(
          currentUser(),
        ).resolves.toBeNull();

        expect(
          readSessionMock,
        ).toHaveBeenCalledWith(
          "raw-session-token",
        );
      },
    );

    it(
      "returns the safe current session user",
      async () => {
        const expires =
          new Date(
            "2026-12-02T00:00:00.000Z",
          );

        getSessionCookieMock
          .mockResolvedValue(
            "raw-session-token",
          );

        readSessionMock
          .mockResolvedValue({
            userId: "user-123",
            name: "Test User",
            email:
              "test@example.com",
            role: "USER",
            status: "ACTIVE",
            expires,
          });

        const result =
          await currentUser();

        expect(result).toEqual({
          userId: "user-123",
          name: "Test User",
          email:
            "test@example.com",
          role: "USER",
          status: "ACTIVE",
          expires,
        });

        expect(result).not.toHaveProperty(
          "passwordHash",
        );

        expect(result).not.toHaveProperty(
          "sessionToken",
        );
      },
    );
  },
);
