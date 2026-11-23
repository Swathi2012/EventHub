import {
  ApplicationError,
} from "../errors/application-error";

import {
  ERROR_CODES,
} from "../errors/error-codes";

const DATABASE_ERROR_MESSAGE =
  "The database operation could not be completed.";

export type DatabaseOperationOptions = {
  operation: string;
};

export async function withDatabaseErrorHandling<T>(
  options: DatabaseOperationOptions,
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof ApplicationError
    ) {
      throw error;
    }

    const operationError = new Error(
      `Database operation failed: ${options.operation}`,
      {
        cause: error,
      },
    );

    throw new ApplicationError({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: DATABASE_ERROR_MESSAGE,
      statusCode: 500,
      cause: operationError,
    });
  }
}
