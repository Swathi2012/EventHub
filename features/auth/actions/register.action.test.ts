import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ApplicationError,
} from "../../../server/errors/application-error";

import {
  isCorrelationId,
} from "../../../server/errors/correlation-id";

import {
  ERROR_CODES,
} from "../../../server/errors/error-codes";

import {
  registerUser,
} from "../services/register-user";

import {
  registerAction,
} from "./register.action";

vi.mock(
  "../services/register-user",
  () => ({
    registerUser: vi.fn(),
  }),
);

const registerUserMock =
  vi.mocked(registerUser);

function createValidFormData():
  FormData {
  const formData = new FormData();

  formData.set(
    "name",
    "Swathi Sivanandham",
  );

  formData.set(
    "email",
    "swathi@example.com",
  );

  formData.set(
    "password",
    "ValidPassword123!",
  );

  formData.set(
    "confirmPassword",
    "ValidPassword123!",
  );

  return formData;
}

describe(
  "registration Server Action",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it(
      "returns a successful registration result",
      async () => {
        registerUserMock.mockResolvedValue({
          userId: "user-123",

          name:
            "Swathi Sivanandham",

          email:
            "swathi@example.com",
        });

        const result =
          await registerAction(
            createValidFormData(),
          );

        expect(result).toEqual({
          ok: true,

          data: {
            userId: "user-123",

            name:
              "Swathi Sivanandham",

            email:
              "swathi@example.com",
          },
        });

        expect(
          registerUserMock,
        ).toHaveBeenCalledOnce();

        expect(
          registerUserMock,
        ).toHaveBeenCalledWith({
          name:
            "Swathi Sivanandham",

          email:
            "swathi@example.com",

          password:
            "ValidPassword123!",
        });
      },
    );

    it(
      "returns field errors for invalid input",
      async () => {
        const formData =
          new FormData();

        formData.set(
          "name",
          "",
        );

        formData.set(
          "email",
          "invalid-email",
        );

        formData.set(
          "password",
          "short",
        );

        formData.set(
          "confirmPassword",
          "different",
        );

        const result =
          await registerAction(
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
          ERROR_CODES.VALIDATION_FAILED,
        );

        expect(
          result.error.fieldErrors,
        ).toEqual(
          expect.objectContaining({
            name:
              expect.any(Array),

            email:
              expect.any(Array),

            password:
              expect.any(Array),

            confirmPassword:
              expect.any(Array),
          }),
        );

        expect(
          registerUserMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects a client-supplied role",
      async () => {
        const formData =
          createValidFormData();

        formData.set(
          "role",
          "ADMIN",
        );

        const result =
          await registerAction(
            formData,
          );

        expect(result.ok).toBe(
          false,
        );

        if (result.ok) {
          throw new Error(
            "Expected role injection to fail.",
          );
        }

        expect(result.error.code).toBe(
          ERROR_CODES.VALIDATION_FAILED,
        );

        expect(
          registerUserMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects a client-supplied account status",
      async () => {
        const formData =
          createValidFormData();

        formData.set(
          "status",
          "ACTIVE",
        );

        const result =
          await registerAction(
            formData,
          );

        expect(result.ok).toBe(
          false,
        );

        if (result.ok) {
          throw new Error(
            "Expected status injection to fail.",
          );
        }

        expect(result.error.code).toBe(
          ERROR_CODES.VALIDATION_FAILED,
        );

        expect(
          registerUserMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "maps a duplicate email to a safe conflict result",
      async () => {
        registerUserMock.mockRejectedValue(
          new ApplicationError({
            code:
              ERROR_CODES.CONFLICT,

            message:
              "An account with this email address already exists.",

            statusCode: 409,
          }),
        );

        const result =
          await registerAction(
            createValidFormData(),
          );

        expect(result).toEqual({
          ok: false,

          error: {
            code:
              ERROR_CODES.CONFLICT,

            message:
              "An account with this email address already exists.",
          },
        });
      },
    );

    it(
      "maps an unexpected error to a safe correlation identifier",
      async () => {
        vi
          .spyOn(
            console,
            "error",
          )
          .mockImplementation(
            () => {},
          );

        registerUserMock.mockRejectedValue(
          new Error(
            "Private database failure",
          ),
        );

        const result =
          await registerAction(
            createValidFormData(),
          );

        expect(result.ok).toBe(
          false,
        );

        if (result.ok) {
          throw new Error(
            "Expected internal failure.",
          );
        }

        expect(result.error.code).toBe(
          ERROR_CODES.INTERNAL_ERROR,
        );

        expect(
          isCorrelationId(
            result.error
              .correlationId ?? "",
          ),
        ).toBe(true);

        expect(
          result.error,
        ).not.toHaveProperty(
          "stack",
        );

        expect(
          result.error,
        ).not.toHaveProperty(
          "cause",
        );

        expect(
          JSON.stringify(
            result.error,
          ),
        ).not.toContain(
          "Private database failure",
        );
      },
    );

    it(
      "does not send server-owned fields to the registration service",
      async () => {
        registerUserMock.mockResolvedValue({
          userId: "user-456",

          name:
            "Swathi Sivanandham",

          email:
            "swathi@example.com",
        });

        await registerAction(
          createValidFormData(),
        );

        const serviceInput =
          registerUserMock.mock
            .calls[0]?.[0];

        expect(
          serviceInput,
        ).toBeDefined();

        expect(
          serviceInput,
        ).not.toHaveProperty(
          "confirmPassword",
        );

        expect(
          serviceInput,
        ).not.toHaveProperty(
          "role",
        );

        expect(
          serviceInput,
        ).not.toHaveProperty(
          "status",
        );

        expect(
          serviceInput,
        ).not.toHaveProperty(
          "passwordHash",
        );

        expect(
          serviceInput,
        ).not.toHaveProperty(
          "emailNormalized",
        );
      },
    );
  },
);
