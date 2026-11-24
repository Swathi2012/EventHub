import {
  describe,
  expect,
  it,
} from "vitest";

import {
  formatRegistrationFieldErrors,
  REGISTRATION_LIMITS,
  registrationSchema,
} from "./registration.schema";

const VALID_REGISTRATION = {
  name: "Swathi Sivanandham",
  email: "swathi@example.com",
  password:
    "ValidPassword123!",
  confirmPassword:
    "ValidPassword123!",
};

describe("registration schema", () => {
  it("accepts valid registration input", () => {
    const result =
      registrationSchema.safeParse(
        VALID_REGISTRATION,
      );

    expect(result.success).toBe(true);
  });

  it("trims the name and email", () => {
    const result =
      registrationSchema.parse({
        ...VALID_REGISTRATION,

        name:
          "  Swathi Sivanandham  ",

        email:
          "  Swathi@Example.com  ",
      });

    expect(result.name).toBe(
      "Swathi Sivanandham",
    );

    expect(result.email).toBe(
      "Swathi@Example.com",
    );
  });

  it("rejects an empty name", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        name: "   ",
      });

    expect(result.success).toBe(false);
  });

  it("rejects a name below the minimum length", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        name: "S",
      });

    expect(result.success).toBe(false);
  });

  it("rejects a name above the maximum length", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,

        name: "S".repeat(
          REGISTRATION_LIMITS.NAME_MAXIMUM +
            1,
        ),
      });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        email: "not-an-email",
      });

    expect(result.success).toBe(false);
  });

  it("rejects an overlong email address", () => {
    const domain =
      "@example.com";

    const localPart =
      "a".repeat(
        REGISTRATION_LIMITS.EMAIL_MAXIMUM -
          domain.length +
          1,
      );

    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        email:
          localPart + domain,
      });

    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        password: "Short123!",
        confirmPassword:
          "Short123!",
      });

    expect(result.success).toBe(false);
  });

  it("rejects an overlong password", () => {
    const password =
      "A".repeat(
        REGISTRATION_LIMITS.PASSWORD_MAXIMUM +
          1,
      );

    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        password,
        confirmPassword:
          password,
      });

    expect(result.success).toBe(false);
  });

  it("rejects a missing password confirmation", () => {
    const result =
      registrationSchema.safeParse({
        name:
          VALID_REGISTRATION.name,

        email:
          VALID_REGISTRATION.email,

        password:
          VALID_REGISTRATION.password,
      });

    expect(result.success).toBe(false);
  });

  it("attaches a password mismatch to confirmPassword", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,

        confirmPassword:
          "DifferentPassword123!",
      });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error(
        "Expected validation to fail.",
      );
    }

    const fieldErrors =
      formatRegistrationFieldErrors(
        result.error,
      );

    expect(
      fieldErrors.confirmPassword,
    ).toContain(
      "Passwords do not match.",
    );
  });

  it("rejects a client-supplied role", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        role: "ADMIN",
      });

    expect(result.success).toBe(false);
  });

  it("rejects a client-supplied account status", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,
        status: "ACTIVE",
      });

    expect(result.success).toBe(false);
  });

  it("rejects client-supplied server fields", () => {
    const result =
      registrationSchema.safeParse({
        ...VALID_REGISTRATION,

        passwordHash:
          "client-controlled-hash",

        emailNormalized:
          "attacker@example.com",

        id: "client-controlled-id",
      });

    expect(result.success).toBe(false);
  });

  it("formats multiple field errors", () => {
    const result =
      registrationSchema.safeParse({
        name: "",
        email: "invalid-email",
        password: "short",
        confirmPassword:
          "different",
      });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error(
        "Expected validation to fail.",
      );
    }

    const fieldErrors =
      formatRegistrationFieldErrors(
        result.error,
      );

    expect(fieldErrors.name).toBeDefined();

    expect(
      fieldErrors.email,
    ).toBeDefined();

    expect(
      fieldErrors.password,
    ).toBeDefined();

    expect(
      fieldErrors.confirmPassword,
    ).toBeDefined();
  });
});
