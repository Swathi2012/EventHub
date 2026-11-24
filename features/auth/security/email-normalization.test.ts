import {
  describe,
  expect,
  it,
} from "vitest";

import {
  normalizeEmail,
} from "./email-normalization";

describe("email normalization", () => {
  it("converts an email to lowercase", () => {
    const result = normalizeEmail(
      "Swathi.Example@Email.COM",
    );

    expect(result).toBe(
      "swathi.example@email.com",
    );
  });

  it("removes leading and trailing whitespace", () => {
    const result = normalizeEmail(
      "  user@example.com  ",
    );

    expect(result).toBe(
      "user@example.com",
    );
  });

  it("produces the same identity for casing and whitespace variants", () => {
    const firstEmail = normalizeEmail(
      "USER@EXAMPLE.COM",
    );

    const secondEmail = normalizeEmail(
      " user@example.com ",
    );

    const thirdEmail = normalizeEmail(
      "User@Example.Com",
    );

    expect(firstEmail).toBe(
      "user@example.com",
    );

    expect(secondEmail).toBe(
      firstEmail,
    );

    expect(thirdEmail).toBe(
      firstEmail,
    );
  });

  it("preserves plus aliases", () => {
    const result = normalizeEmail(
      "User+EventHub@Example.com",
    );

    expect(result).toBe(
      "user+eventhub@example.com",
    );
  });

  it("preserves dots in the local part", () => {
    const result = normalizeEmail(
      "Swathi.Example@Email.com",
    );

    expect(result).toBe(
      "swathi.example@email.com",
    );

    expect(result).not.toBe(
      "swathiexample@email.com",
    );
  });

  it("does not remove internal whitespace", () => {
    const result = normalizeEmail(
      "user @example.com",
    );

    expect(result).toBe(
      "user @example.com",
    );
  });

  it("returns an empty string for whitespace-only input", () => {
    const result = normalizeEmail(
      "   ",
    );

    expect(result).toBe("");
  });

  it("does not mutate the original input value", () => {
    const originalEmail =
      "  User@Example.com  ";

    normalizeEmail(originalEmail);

    expect(originalEmail).toBe(
      "  User@Example.com  ",
    );
  });
});
