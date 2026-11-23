import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isSensitiveKey,
  redactSensitiveData,
  REDACTED_VALUE,
} from "./redact-sensitive-data";

describe("sensitive-data redaction", () => {
  it("detects sensitive keys using different naming styles", () => {
    expect(
      isSensitiveKey("password"),
    ).toBe(true);

    expect(
      isSensitiveKey("PasswordHash"),
    ).toBe(true);

    expect(
      isSensitiveKey("session_token"),
    ).toBe(true);

    expect(
      isSensitiveKey("ACCESS-TOKEN"),
    ).toBe(true);

    expect(
      isSensitiveKey("database_url"),
    ).toBe(true);

    expect(
      isSensitiveKey("email"),
    ).toBe(false);
  });

  it("redacts top-level sensitive values", () => {
    const result = redactSensitiveData({
      email: "user@example.com",
      password: "private-password",
      accessToken: "private-token",
    });

    expect(result).toEqual({
      email: "user@example.com",
      password: REDACTED_VALUE,
      accessToken: REDACTED_VALUE,
    });
  });

  it("redacts sensitive values inside nested objects", () => {
    const result = redactSensitiveData({
      operation: "register-user",

      user: {
        email: "user@example.com",

        credentials: {
          passwordHash: "private-hash",
          refreshToken: "private-token",
        },
      },
    });

    expect(result).toEqual({
      operation: "register-user",

      user: {
        email: "user@example.com",

        credentials: {
          passwordHash: REDACTED_VALUE,
          refreshToken: REDACTED_VALUE,
        },
      },
    });
  });

  it("redacts sensitive values inside arrays", () => {
    const result = redactSensitiveData({
      users: [
        {
          name: "User One",
          password: "private-one",
        },
        {
          name: "User Two",
          sessionToken: "private-two",
        },
      ],
    });

    expect(result).toEqual({
      users: [
        {
          name: "User One",
          password: REDACTED_VALUE,
        },
        {
          name: "User Two",
          sessionToken: REDACTED_VALUE,
        },
      ],
    });
  });

  it("supports nested arrays", () => {
    const result = redactSensitiveData({
      groups: [
        [
          {
            name: "Nested User",
            accessToken: "private-token",
          },
        ],
      ],
    });

    expect(result).toEqual({
      groups: [
        [
          {
            name: "Nested User",
            accessToken: REDACTED_VALUE,
          },
        ],
      ],
    });
  });

  it("redacts the complete value of a sensitive property", () => {
    const result = redactSensitiveData({
      authorization: {
        scheme: "Bearer",
        value: "private-token",
      },
    });

    expect(result).toEqual({
      authorization: REDACTED_VALUE,
    });
  });

  it("preserves non-sensitive primitive values", () => {
    const result = redactSensitiveData({
      eventId: "event-123",
      category: "Technology",
      sortOrder: 10,
      isActive: true,
      description: null,
      optionalValue: undefined,
    });

    expect(result).toEqual({
      eventId: "event-123",
      category: "Technology",
      sortOrder: 10,
      isActive: true,
      description: null,
      optionalValue: undefined,
    });
  });

  it("does not mutate the original input", () => {
    const original = {
      email: "user@example.com",

      credentials: {
        password: "private-password",
      },

      sessions: [
        {
          sessionToken: "private-session",
        },
      ],
    };

    const result =
      redactSensitiveData(original);

    expect(original).toEqual({
      email: "user@example.com",

      credentials: {
        password: "private-password",
      },

      sessions: [
        {
          sessionToken: "private-session",
        },
      ],
    });

    expect(result).toEqual({
      email: "user@example.com",

      credentials: {
        password: REDACTED_VALUE,
      },

      sessions: [
        {
          sessionToken: REDACTED_VALUE,
        },
      ],
    });

    expect(result).not.toBe(original);
  });

  it("preserves non-plain objects", () => {
    const createdAt =
      new Date("2026-11-19T00:00:00.000Z");

    const result =
      redactSensitiveData({
        createdAt,
      }) as {
        createdAt: Date;
      };

    expect(result.createdAt).toBe(
      createdAt,
    );
  });
});
