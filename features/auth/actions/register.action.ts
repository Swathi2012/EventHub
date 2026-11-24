"use server";

import type {
  ActionResult,
} from "../../../lib/action-result";

import {
  actionFailure,
  actionSuccess,
} from "../../../lib/action-result";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  mapError,
} from "../../../server/errors/map-error";

import {
  formatRegistrationFieldErrors,
  registrationSchema,
} from "../schemas/registration.schema";

import {
  createRegistrationAttemptKey,
  registrationAbuseControl,
} from "../security/registration-abuse-control";

import {
  registerUser,
} from "../services/register-user";

import type {
  RegisteredUser,
} from "../services/register-user";

export type RegistrationActionResult =
  ActionResult<RegisteredUser>;

const VALIDATION_ERROR_MESSAGE =
  "Please correct the highlighted fields.";

const RATE_LIMIT_MESSAGE =
  "Too many registration attempts. Please try again later.";

function formDataToObject(
  formData: FormData,
): Record<string, FormDataEntryValue> {
  return Object.fromEntries(
    formData.entries(),
  );
}

export async function registerAction(
  formData: FormData,
): Promise<RegistrationActionResult> {
  const untrustedInput =
    formDataToObject(formData);

  const validationResult =
    registrationSchema.safeParse(
      untrustedInput,
    );

  if (!validationResult.success) {
    return actionFailure({
      code:
        ERROR_CODES.VALIDATION_FAILED,

      message:
        VALIDATION_ERROR_MESSAGE,

      fieldErrors:
        formatRegistrationFieldErrors(
          validationResult.error,
        ),
    });
  }

  const {
    name,
    email,
    password,
  } = validationResult.data;

  const attempt = {
    key:
      createRegistrationAttemptKey(
        email,
      ),
  };

  const decision =
    await registrationAbuseControl
      .consumeAttempt(attempt);

  if (!decision.allowed) {
    return actionFailure({
      code:
        ERROR_CODES.RATE_LIMITED,

      message:
        RATE_LIMIT_MESSAGE,
    });
  }

  try {
    const registeredUser =
      await registerUser({
        name,
        email,
        password,
      });

    await registrationAbuseControl
      .clearAttempts(attempt);

    return actionSuccess(
      registeredUser,
    );
  } catch (error) {
    const mappedError =
      mapError(error);

    return actionFailure(
      mappedError.error,
    );
  }
}
