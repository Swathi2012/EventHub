import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ApplicationError,
} from "../errors/application-error";

import {
  ERROR_CODES,
} from "../errors/error-codes";

import {
  withDatabaseErrorHandling,
} from "./database-error";

describe("database error handling", () => {
  it("returns a successful database result", async () => {
    const result =
      await withDatabaseErrorHandling(
        {
          operation:
            "load-event-categories",
        },
        async () => [
          {
            id: "category-1",
            name: "Technology",
          },
        ],
      );

    expect(result).toEqual([
      {
        id: "category-1",
        name: "Technology",
      },
    ]);
  });

  it("preserves an existing ApplicationError", async () => {
    const expectedError =
      new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message:
          "The requested event was not found.",
        statusCode: 404,
      });

    await expect(
      withDatabaseErrorHandling(
        {
          operation: "find-event",
        },
        async () => {
          throw expectedError;
        },
      ),
    ).rejects.toBe(expectedError);
  });

  it("wraps an unexpected database failure", async () => {
    const databaseError = new Error(
      "Private MySQL connection failure",
    );

    try {
      await withDatabaseErrorHandling(
        {
          operation:
            "load-event-categories",
        },
        async () => {
          throw databaseError;
        },
      );

      throw new Error(
        "Expected the database operation to fail.",
      );
    } catch (error) {
      expect(error).toBeInstanceOf(
        ApplicationError,
      );

      if (
        !(error instanceof ApplicationError)
      ) {
        throw error;
      }

      expect(error.code).toBe(
        ERROR_CODES.INTERNAL_ERROR,
      );

      expect(error.message).toBe(
        "The database operation could not be completed.",
      );

      expect(error.statusCode).toBe(
        500,
      );
    }
  });

  it("preserves safe operation context and the original cause", async () => {
    const databaseError = new Error(
      "Private Prisma failure",
    );

    try {
      await withDatabaseErrorHandling(
        {
          operation: "create-booking",
        },
        async () => {
          throw databaseError;
        },
      );

      throw new Error(
        "Expected the database operation to fail.",
      );
    } catch (error) {
      if (
        !(error instanceof ApplicationError)
      ) {
        throw error;
      }

      expect(error.cause).toBeInstanceOf(
        Error,
      );

      const operationError =
        error.cause;

      if (
        !(operationError instanceof Error)
      ) {
        throw new Error(
          "Expected an internal operation error.",
        );
      }

      expect(operationError.message).toBe(
        "Database operation failed: create-booking",
      );

      expect(operationError.cause).toBe(
        databaseError,
      );
    }
  });
});
