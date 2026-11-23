import {
  describe,
  expect,
  it,
} from "vitest";

import {
  actionFailure,
  actionSuccess,
} from "./action-result";

import {
  ERROR_CODES,
} from "../server/errors/error-codes";

describe("ActionResult", () => {
  it("creates a typed success result", () => {
    const result = actionSuccess({
      userId: "user-123",
      name: "Swathi",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        userId: "user-123",
        name: "Swathi",
      },
    });
  });

  it("creates a failure result with a safe public error", () => {
    const result = actionFailure({
      code: ERROR_CODES.NOT_FOUND,
      message:
        "The requested resource was not found.",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message:
          "The requested resource was not found.",
      },
    });
  });

  it("creates a validation failure with field errors", () => {
    const result = actionFailure({
      code:
        ERROR_CODES.VALIDATION_FAILED,

      message:
        "Please correct the highlighted fields.",

      fieldErrors: {
        email: [
          "Enter a valid email address.",
        ],
      },
    });

    expect(result.ok).toBe(false);

    expect(result.error.fieldErrors).toEqual({
      email: [
        "Enter a valid email address.",
      ],
    });
  });

  it("supports a correlation identifier", () => {
    const result = actionFailure({
      code: ERROR_CODES.INTERNAL_ERROR,
      message:
        "Something went wrong.",
      correlationId:
        "test-correlation-id",
    });

    expect(
      result.error.correlationId,
    ).toBe("test-correlation-id");
  });

  it("narrows success and failure results using ok", () => {
    const success = actionSuccess({
      eventId: "event-123",
    });

    if (success.ok) {
      expect(success.data.eventId).toBe(
        "event-123",
      );
    }

    const failure = actionFailure({
      code: ERROR_CODES.FORBIDDEN,
      message:
        "You do not have permission.",
    });

    if (!failure.ok) {
      expect(failure.error.code).toBe(
        ERROR_CODES.FORBIDDEN,
      );
    }
  });
});
