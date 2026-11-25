"use server";

import type {
  ActionResult,
} from "../../../lib/action-result";

import {
  actionFailure,
  actionSuccess,
} from "../../../lib/action-result";

import {
  createSession,
} from "../../../server/auth/create-session";

import {
  setSessionCookie,
} from "../../../server/auth/session-cookie";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  mapError,
} from "../../../server/errors/map-error";

import {
  formatSignInFieldErrors,
  signInSchema,
} from "../schemas/sign-in.schema";

import {
  createSignInAttemptKey,
  signInAbuseControl,
} from "../security/sign-in-abuse-control";

import {
  verifyCredentials,
} from "../services/verify-credentials";

export type SignInSuccess = {
  userId: string;

  name: string;

  email: string;
};

export type SignInActionResult =
  ActionResult<SignInSuccess>;

const VALIDATION_ERROR_MESSAGE =
  "Please correct the highlighted fields.";

const RATE_LIMIT_MESSAGE =
  "Too many sign-in attempts. Please try again later.";

function formDataToObject(
  formData: FormData,
): Record<
  string,
  FormDataEntryValue
> {
  return Object.fromEntries(
    formData.entries(),
  );
}

export async function signInAction(
  formData: FormData,
): Promise<SignInActionResult> {
  const untrustedInput =
    formDataToObject(formData);

  const validationResult =
    signInSchema.safeParse(
      untrustedInput,
    );

  if (
    !validationResult.success
  ) {
    return actionFailure({
      code:
        ERROR_CODES
          .VALIDATION_FAILED,

      message:
        VALIDATION_ERROR_MESSAGE,

      fieldErrors:
        formatSignInFieldErrors(
          validationResult.error,
        ),
    });
  }

  const {
    email,
    password,
  } = validationResult.data;

  const attempt = {
    key:
      createSignInAttemptKey(
        email,
      ),
  };

  const decision =
    await signInAbuseControl
      .consumeAttempt(attempt);

  if (!decision.allowed) {
    return actionFailure({
      code:
        ERROR_CODES
          .RATE_LIMITED,

      message:
        RATE_LIMIT_MESSAGE,
    });
  }

  try {
    const identity =
      await verifyCredentials({
        email,
        password,
      });

    const session =
      await createSession(
        identity.userId,
      );

    await setSessionCookie(
      session.sessionToken,
      session.expires,
    );

    await signInAbuseControl
      .clearAttempts(attempt);

    return actionSuccess({
      userId:
        identity.userId,

      name:
        identity.name,

      email:
        identity.email,
    });
  } catch (error) {
    const mappedError =
      mapError(error);

    return actionFailure(
      mappedError.error,
    );
  }
}
