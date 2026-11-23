import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ApplicationError,
} from "./application-error";

import {
  ERROR_CODES,
} from "./error-codes";

describe("ApplicationError", () => {
  it("stores a stable code, safe message, and status", () => {
    const error = new ApplicationError({
      code: ERROR_CODES.NOT_FOUND,
      message:
        "The requested resource was not found.",
      statusCode: 404,
    });

    expect(error).toBeInstanceOf(Error);

    expect(error.name).toBe(
      "ApplicationError",
    );

    expect(error.code).toBe(
      ERROR_CODES.NOT_FOUND,
    );

    expect(error.message).toBe(
      "The requested resource was not found.",
    );

    expect(error.statusCode).toBe(404);
  });

  it("stores field-level validation errors", () => {
    const error = new ApplicationError({
      code:
        ERROR_CODES.VALIDATION_FAILED,

      message:
        "Please correct the highlighted fields.",

      statusCode: 400,

      fieldErrors: {
        email: [
          "Enter a valid email address.",
        ],
      },
    });

    expect(error.fieldErrors).toEqual({
      email: [
        "Enter a valid email address.",
      ],
    });
  });

  it("preserves the original internal cause", () => {
    const cause = new Error(
      "Internal provider failure",
    );

    const error = new ApplicationError({
      code: ERROR_CODES.INTERNAL_ERROR,

      message:
        "The operation could not be completed.",

      statusCode: 500,

      cause,
    });

    expect(error.cause).toBe(cause);
  });
});
