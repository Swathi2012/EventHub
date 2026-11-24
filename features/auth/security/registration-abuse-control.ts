import "server-only";

import {
  createHash,
} from "node:crypto";

import {
  normalizeEmail,
} from "./email-normalization";

export const REGISTRATION_LIMITS = {
  MAXIMUM_ATTEMPTS: 5,

  WINDOW_MILLISECONDS:
    15 * 60 * 1000,

  RETRY_AFTER_SECONDS:
    15 * 60,
} as const;

export type RegistrationAttempt = {
  key: string;
};

export type RegistrationAttemptDecision =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      retryAfterSeconds: number;
    };

export interface RegistrationAbuseControl {
  consumeAttempt(
    attempt: RegistrationAttempt,
  ): Promise<RegistrationAttemptDecision>;

  clearAttempts(
    attempt: RegistrationAttempt,
  ): Promise<void>;
}

type AttemptRecord = {
  count: number;
  windowStartedAt: number;
};

export function createRegistrationAttemptKey(
  email: string,
): string {
  const normalizedEmail =
    normalizeEmail(email);

  const digest = createHash(
    "sha256",
  )
    .update(normalizedEmail)
    .digest("hex");

  return `registration:${digest}`;
}

export class InMemoryRegistrationAbuseControl
  implements RegistrationAbuseControl
{
  private readonly attempts =
    new Map<string, AttemptRecord>();

  constructor(
    private readonly now:
      () => number = Date.now,
  ) {}

  async consumeAttempt(
    attempt: RegistrationAttempt,
  ): Promise<RegistrationAttemptDecision> {
    const currentTime =
      this.now();

    const existingRecord =
      this.attempts.get(
        attempt.key,
      );

    if (
      !existingRecord ||
      currentTime -
        existingRecord.windowStartedAt >=
        REGISTRATION_LIMITS
          .WINDOW_MILLISECONDS
    ) {
      this.attempts.set(
        attempt.key,
        {
          count: 1,
          windowStartedAt:
            currentTime,
        },
      );

      return {
        allowed: true,
      };
    }

    if (
      existingRecord.count >=
      REGISTRATION_LIMITS
        .MAXIMUM_ATTEMPTS
    ) {
      const elapsedMilliseconds =
        currentTime -
        existingRecord.windowStartedAt;

      const remainingMilliseconds =
        Math.max(
          0,
          REGISTRATION_LIMITS
            .WINDOW_MILLISECONDS -
            elapsedMilliseconds,
        );

      return {
        allowed: false,

        retryAfterSeconds:
          Math.max(
            1,
            Math.ceil(
              remainingMilliseconds /
                1000,
            ),
          ),
      };
    }

    this.attempts.set(
      attempt.key,
      {
        ...existingRecord,

        count:
          existingRecord.count + 1,
      },
    );

    return {
      allowed: true,
    };
  }

  async clearAttempts(
    attempt: RegistrationAttempt,
  ): Promise<void> {
    this.attempts.delete(
      attempt.key,
    );
  }
}

const globalForAbuseControl =
  globalThis as unknown as {
    registrationAbuseControl?:
      RegistrationAbuseControl;
  };

export const registrationAbuseControl =
  globalForAbuseControl
    .registrationAbuseControl ??
  new InMemoryRegistrationAbuseControl();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForAbuseControl
    .registrationAbuseControl =
    registrationAbuseControl;
}
