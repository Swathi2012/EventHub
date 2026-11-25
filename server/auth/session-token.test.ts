import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createSessionExpiry,
  createSessionToken,
  hashSessionToken,
  SESSION_DURATION_MILLISECONDS,
} from "./session-token";

describe(
  "session token security",
  () => {
    it(
      "creates a high-entropy URL-safe token",
      () => {
        const token =
          createSessionToken();

        expect(token).toMatch(
          /^[A-Za-z0-9_-]{43}$/,
        );
      },
    );

    it(
      "creates different tokens",
      () => {
        expect(
          createSessionToken(),
        ).not.toBe(
          createSessionToken(),
        );
      },
    );

    it(
      "creates a deterministic token digest",
      () => {
        const token =
          "test-session-token";

        expect(
          hashSessionToken(token),
        ).toBe(
          hashSessionToken(token),
        );

        expect(
          hashSessionToken(token),
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "does not expose the raw token in the digest",
      () => {
        const token =
          "private-session-token";

        const digest =
          hashSessionToken(token);

        expect(digest).not.toContain(
          token,
        );
      },
    );

    it(
      "creates the approved session expiry",
      () => {
        const currentTime =
          Date.parse(
            "2026-11-25T00:00:00.000Z",
          );

        expect(
          createSessionExpiry(
            currentTime,
          ).getTime(),
        ).toBe(
          currentTime +
            SESSION_DURATION_MILLISECONDS,
        );
      },
    );
  },
);
