import {
  describe,
  expect,
  it,
} from "vitest";

import {
  formatSignInFieldErrors,
  SIGN_IN_LIMITS,
  signInSchema,
} from "./sign-in.schema";

const VALID_INPUT = {
  email:
    "swathi@example.com",

  password:
    "ValidPassword123!",
};

describe(
  "sign-in schema",
  () => {
    it(
      "accepts valid credentials",
      () => {
        const result =
          signInSchema.safeParse(
            VALID_INPUT,
          );

        expect(
          result.success,
        ).toBe(true);
      },
    );

    it(
      "trims the email address",
      () => {
        const result =
          signInSchema.parse({
            ...VALID_INPUT,

            email:
              "  Swathi@Example.com  ",
          });

        expect(result.email).toBe(
          "Swathi@Example.com",
        );
      },
    );

    it(
      "rejects an invalid email",
      () => {
        const result =
          signInSchema.safeParse({
            ...VALID_INPUT,
            email:
              "invalid-email",
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects a missing password",
      () => {
        const result =
          signInSchema.safeParse({
            email:
              VALID_INPUT.email,

            password: "",
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects an overlong email",
      () => {
        const domain =
          "@example.com";

        const localPart =
          "a".repeat(
            SIGN_IN_LIMITS
              .EMAIL_MAXIMUM -
              domain.length +
              1,
          );

        const result =
          signInSchema.safeParse({
            ...VALID_INPUT,

            email:
              localPart +
              domain,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects an overlong password",
      () => {
        const result =
          signInSchema.safeParse({
            ...VALID_INPUT,

            password:
              "A".repeat(
                SIGN_IN_LIMITS
                  .PASSWORD_MAXIMUM +
                  1,
              ),
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects client-supplied privileged fields",
      () => {
        const result =
          signInSchema.safeParse({
            ...VALID_INPUT,
            role: "ADMIN",
            status: "ACTIVE",
            userId: "user-123",
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "formats field errors",
      () => {
        const result =
          signInSchema.safeParse({
            email:
              "invalid-email",

            password: "",
          });

        expect(
          result.success,
        ).toBe(false);

        if (result.success) {
          throw new Error(
            "Expected validation failure.",
          );
        }

        const fieldErrors =
          formatSignInFieldErrors(
            result.error,
          );

        expect(
          fieldErrors.email,
        ).toBeDefined();

        expect(
          fieldErrors.password,
        ).toBeDefined();
      },
    );
  },
);
