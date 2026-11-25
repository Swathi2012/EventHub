import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  deleteSession,
} from "./delete-session";

import {
  clearSessionCookie,
  getSessionCookie,
} from "./session-cookie";

import {
  revokeCurrentSession,
} from "./revoke-current-session";

vi.mock(
  "./delete-session",
  () => ({
    deleteSession:
      vi.fn(),
  }),
);

vi.mock(
  "./session-cookie",
  () => ({
    getSessionCookie:
      vi.fn(),

    clearSessionCookie:
      vi.fn(),
  }),
);

const deleteSessionMock =
  vi.mocked(deleteSession);

const getSessionCookieMock =
  vi.mocked(getSessionCookie);

const clearSessionCookieMock =
  vi.mocked(clearSessionCookie);

describe(
  "revokeCurrentSession",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      deleteSessionMock
        .mockResolvedValue();

      clearSessionCookieMock
        .mockResolvedValue();
    });

    it(
      "deletes the active database session and clears the cookie",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(
            "raw-session-token",
          );

        await revokeCurrentSession();

        expect(
          deleteSessionMock,
        ).toHaveBeenCalledWith(
          "raw-session-token",
        );

        expect(
          clearSessionCookieMock,
        ).toHaveBeenCalledOnce();
      },
    );

    it(
      "clears the cookie when no session token exists",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(null);

        await revokeCurrentSession();

        expect(
          deleteSessionMock,
        ).not.toHaveBeenCalled();

        expect(
          clearSessionCookieMock,
        ).toHaveBeenCalledOnce();
      },
    );

    it(
      "clears the cookie even when database deletion fails",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(
            "raw-session-token",
          );

        deleteSessionMock
          .mockRejectedValue(
            new Error(
              "Private database failure",
            ),
          );

        await expect(
          revokeCurrentSession(),
        ).rejects.toThrow(
          "Private database failure",
        );

        expect(
          clearSessionCookieMock,
        ).toHaveBeenCalledOnce();
      },
    );

    it(
      "does not expose the session token in a return value",
      async () => {
        getSessionCookieMock
          .mockResolvedValue(
            "private-session-token",
          );

        const result =
          await revokeCurrentSession();

        expect(result).toBeUndefined();
      },
    );
  },
);
