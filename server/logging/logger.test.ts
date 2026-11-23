import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createLogEntry,
  logger,
  LOG_LEVELS,
} from "./logger";

import {
  REDACTED_VALUE,
} from "./redact-sensitive-data";

describe("structured logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a structured log entry", () => {
    const entry = createLogEntry({
      level: LOG_LEVELS.INFO,
      message:
        "Event categories loaded",
      correlationId:
        "test-correlation-id",
      metadata: {
        categoryCount: 7,
      },
    });

    expect(entry.level).toBe(
      LOG_LEVELS.INFO,
    );

    expect(entry.message).toBe(
      "Event categories loaded",
    );

    expect(entry.correlationId).toBe(
      "test-correlation-id",
    );

    expect(entry.metadata).toEqual({
      categoryCount: 7,
    });

    expect(
      Number.isNaN(
        Date.parse(entry.timestamp),
      ),
    ).toBe(false);
  });

  it("redacts sensitive metadata", () => {
    const entry = createLogEntry({
      level: LOG_LEVELS.ERROR,
      message:
        "Sign-in operation failed",
      metadata: {
        email: "user@example.com",
        password:
          "private-password",
        sessionToken:
          "private-session-token",
        authorization:
          "Bearer private-token",
      },
    });

    expect(entry.metadata).toEqual({
      email: "user@example.com",
      password:
        REDACTED_VALUE,
      sessionToken:
        REDACTED_VALUE,
      authorization:
        REDACTED_VALUE,
    });
  });

  it("serializes Error objects", () => {
    const cause = new Error(
      "Database connection failed",
    );

    const error = new Error(
      "Booking creation failed",
      {
        cause,
      },
    );

    const entry = createLogEntry({
      level: LOG_LEVELS.ERROR,
      message:
        "Booking operation failed",
      metadata: {
        operation:
          "create-booking",
        error,
      },
    });

    expect(entry.metadata).toEqual({
      operation:
        "create-booking",

      error: expect.objectContaining({
        name: "Error",
        message:
          "Booking creation failed",

        stack:
          expect.any(String),

        cause:
          expect.objectContaining({
            name: "Error",
            message:
              "Database connection failed",
            stack:
              expect.any(String),
          }),
      }),
    });
  });

  it("routes info entries to console.info", () => {
    const consoleSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => {});

    logger.info(
      "Application started",
      {
        metadata: {
          environment:
            "development",
        },
      },
    );

    expect(consoleSpy).toHaveBeenCalledOnce();

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LOG_LEVELS.INFO,
        message:
          "Application started",

        metadata: {
          environment:
            "development",
        },
      }),
    );
  });

  it("routes warning entries to console.warn", () => {
    const consoleSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    logger.warn(
      "Invalid status transition attempted",
      {
        correlationId:
          "warning-correlation-id",

        metadata: {
          currentStatus:
            "CANCELLED",

          requestedStatus:
            "PUBLISHED",
        },
      },
    );

    expect(consoleSpy).toHaveBeenCalledOnce();

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LOG_LEVELS.WARN,

        message:
          "Invalid status transition attempted",

        correlationId:
          "warning-correlation-id",
      }),
    );
  });

  it("routes error entries to console.error", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    logger.error(
      "Database operation failed",
      {
        correlationId:
          "error-correlation-id",

        metadata: {
          operation:
            "create-user",

          password:
            "private-password",
        },
      },
    );

    expect(consoleSpy).toHaveBeenCalledOnce();

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LOG_LEVELS.ERROR,

        message:
          "Database operation failed",

        correlationId:
          "error-correlation-id",

        metadata: {
          operation:
            "create-user",

          password:
            REDACTED_VALUE,
        },
      }),
    );
  });
});
