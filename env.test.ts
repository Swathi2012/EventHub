import { describe, expect, it } from "vitest";

import { parseEnvironment } from "./env";

const validDatabaseUrl =
  "mysql://test_user:test_password@localhost:3306/eventhub_test";

describe("EventHub environment configuration", () => {
  it("accepts valid environment values", () => {
    const environment = parseEnvironment({
      APP_ENV: "test",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      DATABASE_URL: validDatabaseUrl,
    });

    expect(environment).toEqual({
      APP_ENV: "test",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      DATABASE_URL: validDatabaseUrl,
    });
  });

  it("rejects an invalid application URL", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "test",
        NEXT_PUBLIC_APP_URL: "invalid-url",
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow(
      "EventHub environment configuration is invalid.",
    );
  });

  it("rejects an unsupported environment name", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "invalid",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow(
      "EventHub environment configuration is invalid.",
    );
  });

  it("rejects a non-MySQL database URL", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "test",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        DATABASE_URL:
          "postgresql://user:password@localhost:5432/eventhub",
      }),
    ).toThrow(
      "EventHub environment configuration is invalid.",
    );
  });

  it("rejects a missing database URL", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "test",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow(
      "EventHub environment configuration is invalid.",
    );
  });
});
