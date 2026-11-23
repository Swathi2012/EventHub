import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ApplicationError,
} from "./application-error";

import {
  isCorrelationId,
} from "./correlation-id";

import {
  ERROR_CODES,
} from "./error-codes";

import {
  mapApplicationError,
  mapError,
  mapUnexpectedError,
} from "./map-error";

describe("error mapping", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps a known application error", () => {
    const error = new ApplicationError({
      code: ERROR_CODES.NOT_FOUND,
      message:
        "The requested event was not found.",
      statusCode: 404,
    });

    const result =
      mapApplicationError(error);

    expect(result).toEqual({
      statusCode: 404,

      error: {
        code: ERROR_CODES.NOT_FOUND,

        message:
          "The requested event was not found.",
      },
    });
  });

  it("preserves validation field errors", () => {
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

    const result =
      mapError(error);

    expect(result).toEqual({
      statusCode: 400,

      error: {
        code:
          ERROR_CODES.VALIDATION_FAILED,

        message:
          "Please correct the highlighted fields.",

        fieldErrors: {
          email: [
            "Enter a valid email address.",
          ],
        },
      },
    });
  });

  it("maps an unexpected error to a safe internal error", () => {
    vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = mapUnexpectedError(
      new Error(
        "Private database failure",
      ),
    );

    expect(result.statusCode).toBe(500);

    expect(result.error.code).toBe(
      ERROR_CODES.INTERNAL_ERROR,
    );

    expect(result.error.message).toBe(
      "Something went wrong. Please try again.",
    );

    expect(
      result.error.correlationId,
    ).toBeDefined();

    expect(
      isCorrelationId(
        result.error.correlationId ?? "",
      ),
    ).toBe(true);
  });

  it("logs an unexpected error with the same correlation identifier", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const internalError = new Error(
      "Private provider failure",
    );

    const result =
      mapUnexpectedError(
        internalError,
      );

    expect(consoleSpy).toHaveBeenCalledOnce();

    const loggedEntry =
      consoleSpy.mock.calls[0]?.[0];

    expect(loggedEntry).toEqual(
      expect.objectContaining({
        level: "error",

        message:
          "Unexpected application error",

        correlationId:
          result.error.correlationId,
      }),
    );

    expect(loggedEntry).toEqual(
      expect.objectContaining({
        metadata:
          expect.objectContaining({
            error:
              expect.objectContaining({
                name: "Error",

                message:
                  "Private provider failure",

                stack:
                  expect.any(String),
              }),
          }),
      }),
    );
  });

  it("does not expose stack or cause in the public error", () => {
    vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const cause = new Error(
      "Private database cause",
    );

    const internalError = new Error(
      "Private operation failure",
      {
        cause,
      },
    );

    const result =
      mapError(internalError);

    expect(result.error).not.toHaveProperty(
      "stack",
    );

    expect(result.error).not.toHaveProperty(
      "cause",
    );

    expect(
      JSON.stringify(result.error),
    ).not.toContain(
      "Private database cause",
    );

    expect(
      JSON.stringify(result.error),
    ).not.toContain(
      "Private operation failure",
    );
  });

  it("handles non-Error thrown values safely", () => {
    vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = mapError({
      operation: "authenticate-user",
      password: "private-password",
      accessToken: "private-token",
    });

    expect(result.statusCode).toBe(500);

    expect(result.error.code).toBe(
      ERROR_CODES.INTERNAL_ERROR,
    );

    expect(
      isCorrelationId(
        result.error.correlationId ?? "",
      ),
    ).toBe(true);
  });
});
