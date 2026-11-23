import type {
  PublicError,
} from "../../lib/action-result";

import {
  logger,
} from "../logging/logger";

import {
  ApplicationError,
} from "./application-error";

import {
  createCorrelationId,
} from "./correlation-id";

import {
  ERROR_CODES,
} from "./error-codes";

export type MappedError = {
  statusCode: number;
  error: PublicError;
};

export function mapApplicationError(
  error: ApplicationError,
): MappedError {
  const publicError: PublicError = {
    code: error.code,
    message: error.message,
  };

  if (error.fieldErrors) {
    publicError.fieldErrors =
      error.fieldErrors;
  }

  return {
    statusCode: error.statusCode,
    error: publicError,
  };
}

export function mapUnexpectedError(
  error: unknown,
): MappedError {
  const correlationId =
    createCorrelationId();

  logger.error(
    "Unexpected application error",
    {
      correlationId,

      metadata: {
        error,
      },
    },
  );

  return {
    statusCode: 500,

    error: {
      code:
        ERROR_CODES.INTERNAL_ERROR,

      message:
        "Something went wrong. Please try again.",

      correlationId,
    },
  };
}

export function mapError(
  error: unknown,
): MappedError {
  if (
    error instanceof ApplicationError
  ) {
    return mapApplicationError(error);
  }

  return mapUnexpectedError(error);
}
