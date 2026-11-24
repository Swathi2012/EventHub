import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRegistrationAttemptKey,
  InMemoryRegistrationAbuseControl,
  REGISTRATION_LIMITS,
} from "./registration-abuse-control";

describe(
  "registration abuse control",
  () => {
    it(
      "creates the same privacy-safe key for equivalent emails",
      () => {
        const firstKey =
          createRegistrationAttemptKey(
            "USER@EXAMPLE.COM",
          );

        const secondKey =
          createRegistrationAttemptKey(
            " user@example.com ",
          );

        expect(firstKey).toBe(
          secondKey,
        );

        expect(firstKey).not.toContain(
          "user@example.com",
        );

        expect(firstKey).toMatch(
          /^registration:[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "allows attempts within the configured limit",
      async () => {
        const control =
          new InMemoryRegistrationAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key:
            "registration:test-key",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await expect(
            control.consumeAttempt(
              attempt,
            ),
          ).resolves.toEqual({
            allowed: true,
          });
        }
      },
    );

    it(
      "blocks an attempt after the configured limit",
      async () => {
        const control =
          new InMemoryRegistrationAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key:
            "registration:test-key",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        const decision =
          await control.consumeAttempt(
            attempt,
          );

        expect(decision).toEqual({
          allowed: false,

          retryAfterSeconds:
            REGISTRATION_LIMITS
              .RETRY_AFTER_SECONDS,
        });
      },
    );

    it(
      "keeps different identities in separate attempt windows",
      async () => {
        const control =
          new InMemoryRegistrationAbuseControl(
            () => 1_000,
          );

        const firstAttempt = {
          key:
            "registration:first",
        };

        const secondAttempt = {
          key:
            "registration:second",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
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
      "starts a new window after the previous window expires",
      async () => {
        let currentTime = 1_000;

        const control =
          new InMemoryRegistrationAbuseControl(
            () => currentTime,
          );

        const attempt = {
          key:
            "registration:test-key",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        currentTime +=
          REGISTRATION_LIMITS
            .WINDOW_MILLISECONDS;

        await expect(
          control.consumeAttempt(
            attempt,
          ),
        ).resolves.toEqual({
          allowed: true,
        });
      },
    );

    it(
      "returns the remaining retry duration",
      async () => {
        let currentTime = 1_000;

        const control =
          new InMemoryRegistrationAbuseControl(
            () => currentTime,
          );

        const attempt = {
          key:
            "registration:test-key",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
            .MAXIMUM_ATTEMPTS;
          index += 1
        ) {
          await control.consumeAttempt(
            attempt,
          );
        }

        currentTime += 60_000;

        const decision =
          await control.consumeAttempt(
            attempt,
          );

        expect(decision).toEqual({
          allowed: false,

          retryAfterSeconds:
            REGISTRATION_LIMITS
              .RETRY_AFTER_SECONDS -
            60,
        });
      },
    );

    it(
      "clears attempts after successful registration",
      async () => {
        const control =
          new InMemoryRegistrationAbuseControl(
            () => 1_000,
          );

        const attempt = {
          key:
            "registration:test-key",
        };

        for (
          let index = 0;
          index <
          REGISTRATION_LIMITS
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
          control.consumeAttempt(
            attempt,
          ),
        ).resolves.toEqual({
          allowed: true,
        });
      },
    );
  },
);
