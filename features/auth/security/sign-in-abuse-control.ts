import "server-only";

import {
  createHash,
} from "node:crypto";

import {
  normalizeEmail,
} from "./email-normalization";

export const SIGN_IN_ATTEMPT_LIMITS = {
  MAXIMUM_ATTEMPTS: 5,

  WINDOW_MILLISECONDS:
    15 * 60 * 1000,

  RETRY_AFTER_SECONDS:
    15 * 60,
} as const;

export type SignInAttempt = {
  key: string;
};

export type SignInAttemptDecision =
  | {
      allowed: true;
    }
  | {
      allowed: false;

      retryAfterSeconds:
        number;
    };

export interface SignInAbuseControl {
  consumeAttempt(
    attempt: SignInAttempt,
  ): Promise<SignInAttemptDecision>;

  clearAttempts(
    attempt: SignInAttempt,
  ): Promise<void>;
}

type AttemptRecord = {
  count: number;

  windowStartedAt:
    number;
};

export function createSignInAttemptKey(
  email: string,
): string {
  const normalizedEmail =
    normalizeEmail(email);

  const digest =
    createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

  return `sign-in:${digest}`;
}

export class InMemorySignInAbuseControl
  implements SignInAbuseControl
{
  private readonly attempts =
    new Map<
      string,
      AttemptRecord
    >();

  constructor(
    private readonly now:
      () => number = Date.now,
  ) {}

  async consumeAttempt(
    attempt: SignInAttempt,
  ): Promise<SignInAttemptDecision> {
    const currentTime =
      this.now();

    const existingRecord =
      this.attempts.get(
        attempt.key,
      );

    if (
      !existingRecord ||
      currentTime -
        existingRecord
          .windowStartedAt >=
        SIGN_IN_ATTEMPT_LIMITS
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
      SIGN_IN_ATTEMPT_LIMITS
        .MAXIMUM_ATTEMPTS
    ) {
      const elapsedMilliseconds =
        currentTime -
        existingRecord
          .windowStartedAt;

      const remainingMilliseconds =
        Math.max(
          0,

          SIGN_IN_ATTEMPT_LIMITS
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
          existingRecord.count +
          1,
      },
    );

    return {
      allowed: true,
    };
  }

  async clearAttempts(
    attempt: SignInAttempt,
  ): Promise<void> {
    this.attempts.delete(
      attempt.key,
    );
  }
}

const globalForSignInControl =
  globalThis as unknown as {
    signInAbuseControl?:
      SignInAbuseControl;
  };

export const signInAbuseControl =
  globalForSignInControl
    .signInAbuseControl ??
  new InMemorySignInAbuseControl();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForSignInControl
    .signInAbuseControl =
    signInAbuseControl;
}
