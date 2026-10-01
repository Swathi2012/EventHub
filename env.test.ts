import { describe, expect, it } from "vitest";
import { parseEnvironment } from "./env";

describe("EventHub environment configuration", () => {
  it("accepts valid environment values", () => {
    const environment = parseEnvironment({
      APP_ENV: "test",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });

    expect(environment).toEqual({
      APP_ENV: "test",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("rejects an invalid application URL", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "test",
        NEXT_PUBLIC_APP_URL: "invalid-url",
      }),
    ).toThrow("EventHub environment configuration is invalid.");
  });

  it("rejects an unsupported environment name", () => {
    expect(() =>
      parseEnvironment({
        APP_ENV: "invalid",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow("EventHub environment configuration is invalid.");
  });
});
