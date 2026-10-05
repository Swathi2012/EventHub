import { describe, expect, it } from "vitest";

import { parseDatabaseUrl } from "./database-url";

describe("parseDatabaseUrl", () => {
  it("parses a valid MySQL database URL", () => {
    const result = parseDatabaseUrl(
      "mysql://eventhub_user:test_password@localhost:3306/eventhub",
    );

    expect(result).toEqual({
      host: "localhost",
      port: 3306,
      user: "eventhub_user",
      password: "test_password",
      database: "eventhub",
    });
  });

  it("uses port 3306 when the port is omitted", () => {
    const result = parseDatabaseUrl(
      "mysql://eventhub_user:test_password@localhost/eventhub",
    );

    expect(result.port).toBe(3306);
  });

  it("decodes an encoded password", () => {
    const result = parseDatabaseUrl(
      "mysql://eventhub_user:pass%40word@localhost:3306/eventhub",
    );

    expect(result.password).toBe("pass@word");
  });

  it("rejects a non-MySQL URL", () => {
    expect(() =>
      parseDatabaseUrl("postgresql://user:password@localhost:5432/eventhub"),
    ).toThrow("EventHub database must use MySQL.");
  });

  it("rejects a missing database name", () => {
    expect(() =>
      parseDatabaseUrl("mysql://user:password@localhost:3306"),
    ).toThrow("EventHub database name is missing from DATABASE_URL.");
  });
});
