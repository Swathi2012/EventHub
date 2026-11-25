import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  redirect,
} from "next/navigation";

import {
  revokeCurrentSession,
} from "../../../server/auth/revoke-current-session";

import {
  signOutAction,
} from "./sign-out.action";

vi.mock(
  "../../../server/auth/revoke-current-session",
  () => ({
    revokeCurrentSession:
      vi.fn(),
  }),
);

vi.mock(
  "next/navigation",
  () => ({
    redirect:
      vi.fn(),
  }),
);

const revokeCurrentSessionMock =
  vi.mocked(
    revokeCurrentSession,
  );

const redirectMock =
  vi.mocked(redirect);

describe(
  "signOutAction",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      revokeCurrentSessionMock
        .mockResolvedValue();
    });

    it(
      "revokes the active session before redirecting",
      async () => {
        redirectMock
          .mockImplementation(
            () => {
              throw new Error(
                "NEXT_REDIRECT",
              );
            },
          );

        await expect(
          signOutAction(),
        ).rejects.toThrow(
          "NEXT_REDIRECT",
        );

        expect(
          revokeCurrentSessionMock,
        ).toHaveBeenCalledOnce();

        expect(
          redirectMock,
        ).toHaveBeenCalledWith(
          "/",
        );

        expect(
          revokeCurrentSessionMock.mock
            .invocationCallOrder[0],
        ).toBeLessThan(
          redirectMock.mock
            .invocationCallOrder[0] ??
            Number.MAX_SAFE_INTEGER,
        );
      },
    );

    it(
      "does not redirect when session revocation fails",
      async () => {
        revokeCurrentSessionMock
          .mockRejectedValue(
            new Error(
              "Session deletion failed",
            ),
          );

        await expect(
          signOutAction(),
        ).rejects.toThrow(
          "Session deletion failed",
        );

        expect(
          redirectMock,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
