import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createSignInAttemptKey,
  InMemorySignInAbuseControl,
  SIGN_IN_ATTEMPT_LIMITS,
} from "./sign-in-abuse-control";

describe(
  "sign-in abuse control",
  () => {
    it(
      "creates the same key for equivalent emails",
      () => {
        const firstKey =
          createSignInAttemptKey(
            "USER@EXAMPLE.COM",
          );

        const secondKey =
          createSignInAttemptKey(
            " user@example.com ",
          );

        expect(firstKey).toBe(
          secondKey,
        );

        expect(firstKey).not.toContain(
          "user@example.com",
        );

        expect(firstKey).toMatch(
          /^sign-in:[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "allows attempts within the limit",
      async () => {
        const control =
          new InMemorySignInAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key: "sign-in:test",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await expect(
            control.consumeAttempt(attempt),
          ).resolves.toEqual({
            allowed: true,
          });
        }
      },
    );

    it(
      "blocks attempts after the limit",
      async () => {
        const control =
          new InMemorySignInAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key: "sign-in:test",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        await expect(
          control.consumeAttempt(attempt),
        ).resolves.toEqual({
          allowed: false,

          retryAfterSeconds:
            SIGN_IN_ATTEMPT_LIMITS
              .RETRY_AFTER_SECONDS,
        });
      },
    );

    it(
      "keeps different identities separate",
      async () => {
        const control =
          new InMemorySignInAbuseControl(
            () => 1_000,
          );

        const firstAttempt = {
          key: "sign-in:first",
        };

        const secondAttempt = {
          key: "sign-in:second",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            firstAttempt,
          );
        }

        await expect(
          control.consumeAttempt(
            firstAttempt,
          ),
        ).resolves.toMatchObject({
          allowed: false,
        });

        await expect(
          control.consumeAttempt(
            secondAttempt,
          ),
        ).resolves.toEqual({
          allowed: true,
        });
      },
    );

    it(
      "starts a new window after expiry",
      async () => {
        let currentTime = 1_000;

        const control =
          new InMemorySignInAbuseControl(
            () => currentTime,
          );

        const attempt = {
          key: "sign-in:test",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        currentTime +=
          SIGN_IN_ATTEMPT_LIMITS
            .WINDOW_MILLISECONDS;

        await expect(
          control.consumeAttempt(attempt),
        ).resolves.toEqual({
          allowed: true,
        });
      },
    );

    it(
      "returns remaining retry time",
      async () => {
        let currentTime = 1_000;

        const control =
          new InMemorySignInAbuseControl(
            () => currentTime,
          );

        const attempt = {
          key: "sign-in:test",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        currentTime += 60_000;

        await expect(
          control.consumeAttempt(attempt),
        ).resolves.toEqual({
          allowed: false,

          retryAfterSeconds:
            SIGN_IN_ATTEMPT_LIMITS
              .RETRY_AFTER_SECONDS -
            60,
        });
      },
    );

    it(
      "clears attempts after successful sign-in",
      async () => {
        const control =
          new InMemorySignInAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key: "sign-in:test",
        };

        for (
          let index = 0;
          index <
          SIGN_IN_ATTEMPT_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        await control.clearAttempts(
          attempt,
        );

        await expect(
          control.consumeAttempt(attempt),
        ).resolves.toEqual({
          allowed: true,
        });
      },
    );
  },
);
