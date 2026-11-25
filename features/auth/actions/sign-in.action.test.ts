import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createSession,
} from "../../../server/auth/create-session";

import {
  setSessionCookie,
} from "../../../server/auth/session-cookie";

import {
  ApplicationError,
} from "../../../server/errors/application-error";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  verifyCredentials,
} from "../services/verify-credentials";

import {
  signInAction,
} from "./sign-in.action";

vi.mock(
  "../services/verify-credentials",
  () => ({
    verifyCredentials:
      vi.fn(),
  }),
);

vi.mock(
  "../../../server/auth/create-session",
  () => ({
    createSession:
      vi.fn(),
  }),
);

vi.mock(
  "../../../server/auth/session-cookie",
  () => ({
    setSessionCookie:
      vi.fn(),
  }),
);

const verifyCredentialsMock =
  vi.mocked(
    verifyCredentials,
  );

const createSessionMock =
  vi.mocked(
    createSession,
  );

const setSessionCookieMock =
  vi.mocked(
    setSessionCookie,
  );

function createValidFormData():
  FormData {
  const formData =
    new FormData();

  formData.set(
    "email",
    "swathi@example.com",
  );

  formData.set(
    "password",
    "ValidPassword123!",
  );

  return formData;
}

describe(
  "signInAction",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      setSessionCookieMock
        .mockResolvedValue();
    });

    it(
      "creates a session for valid credentials",
      async () => {
        const expires =
          new Date(
            "2026-12-02T00:00:00.000Z",
          );

        verifyCredentialsMock
          .mockResolvedValue({
            userId:
              "user-123",

            name:
              "Swathi Sivanandham",

            email:
              "Swathi@Example.com",

            role: "USER",

            status: "ACTIVE",
          });

        createSessionMock
          .mockResolvedValue({
            sessionToken:
              "raw-session-token",

            expires,
          });

        const result =
          await signInAction(
            createValidFormData(),
          );

        expect(result).toEqual({
          ok: true,

          data: {
            userId:
              "user-123",

            name:
              "Swathi Sivanandham",

            email:
              "Swathi@Example.com",
          },
        });

        expect(
          verifyCredentialsMock,
        ).toHaveBeenCalledWith({
          email:
            "swathi@example.com",

          password:
            "ValidPassword123!",
        });

        expect(
          createSessionMock,
        ).toHaveBeenCalledWith(
          "user-123",
        );

        expect(
          setSessionCookieMock,
        ).toHaveBeenCalledWith(
          "raw-session-token",
          expires,
        );
      },
    );

    it(
      "returns field errors for invalid input",
      async () => {
        const formData =
          new FormData();

        formData.set(
          "email",
          "invalid-email",
        );

        formData.set(
          "password",
          "",
        );

        const result =
          await signInAction(
            formData,
          );

        expect(result.ok).toBe(
          false,
        );

        if (result.ok) {
          throw new Error(
            "Expected validation failure.",
          );
        }

        expect(result.error.code).toBe(
          ERROR_CODES
            .VALIDATION_FAILED,
        );

        expect(
          result.error.fieldErrors,
        ).toEqual(
          expect.objectContaining({
            email:
              expect.any(Array),

            password:
              expect.any(Array),
          }),
        );

        expect(
          verifyCredentialsMock,
        ).not.toHaveBeenCalled();

        expect(
          createSessionMock,
        ).not.toHaveBeenCalled();

        expect(
          setSessionCookieMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects client-supplied privileged fields",
      async () => {
        const formData =
          createValidFormData();

        formData.set(
          "role",
          "ADMIN",
        );

        const result =
          await signInAction(
            formData,
          );

        expect(result.ok).toBe(
          false,
        );

        expect(
          verifyCredentialsMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns the generic invalid-credentials error",
      async () => {
        verifyCredentialsMock
          .mockRejectedValue(
            new ApplicationError({
              code:
                ERROR_CODES
                  .AUTHENTICATION_REQUIRED,

              message:
                "Invalid email or password.",

              statusCode: 401,
            }),
          );

        const result =
          await signInAction(
            createValidFormData(),
          );

        expect(result).toEqual({
          ok: false,

          error: {
            code:
              ERROR_CODES
                .AUTHENTICATION_REQUIRED,

            message:
              "Invalid email or password.",
          },
        });

        expect(
          createSessionMock,
        ).not.toHaveBeenCalled();

        expect(
          setSessionCookieMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns a safe blocked-account error",
      async () => {
        verifyCredentialsMock
          .mockRejectedValue(
            new ApplicationError({
              code:
                ERROR_CODES
                  .ACCOUNT_SUSPENDED,

              message:
                "This account is not available for sign-in.",

              statusCode: 403,
            }),
          );

        const result =
          await signInAction(
            createValidFormData(),
          );

        expect(result).toEqual({
          ok: false,

          error: {
            code:
              ERROR_CODES
                .ACCOUNT_SUSPENDED,

            message:
              "This account is not available for sign-in.",
          },
        });

        expect(
          createSessionMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "does not expose the session token",
      async () => {
        verifyCredentialsMock
          .mockResolvedValue({
            userId:
              "user-123",

            name:
              "Test User",

            email:
              "test@example.com",

            role: "USER",

            status: "ACTIVE",
          });

        createSessionMock
          .mockResolvedValue({
            sessionToken:
              "private-session-token",

            expires:
              new Date(
                "2026-12-02T00:00:00.000Z",
              ),
          });

        const result =
          await signInAction(
            createValidFormData(),
          );

        expect(
          JSON.stringify(result),
        ).not.toContain(
          "private-session-token",
        );
      },
    );

    it(
      "does not create a cookie when session creation fails",
      async () => {
        vi
          .spyOn(
            console,
            "error",
          )
          .mockImplementation(
            () => {},
          );

        verifyCredentialsMock
          .mockResolvedValue({
            userId:
              "user-123",

            name:
              "Test User",

            email:
              "test@example.com",

            role: "USER",

            status: "ACTIVE",
          });

        createSessionMock
          .mockRejectedValue(
            new Error(
              "Private database failure",
            ),
          );

        const result =
          await signInAction(
            createValidFormData(),
          );

        expect(result.ok).toBe(
          false,
        );

        if (result.ok) {
          throw new Error(
            "Expected sign-in failure.",
          );
        }

        expect(result.error.code).toBe(
          ERROR_CODES
            .INTERNAL_ERROR,
        );

        expect(
          setSessionCookieMock,
        ).not.toHaveBeenCalled();

        expect(
          JSON.stringify(
            result.error,
          ),
        ).not.toContain(
          "Private database failure",
        );
      },
    );
  },
);
