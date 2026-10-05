/**
 * Safe application error for unexpected database failures.
 *
 * Raw Prisma or MySQL errors may contain table names,
 * constraint names, query information, or connection details.
 * Those details must not be sent directly to browser users.
 */
export class DatabaseUnavailableError extends Error {
  readonly code = "DATABASE_UNAVAILABLE";

  constructor() {
    super("The database operation could not be completed.");

    this.name = "DatabaseUnavailableError";
  }
}

/**
 * Executes a database operation and converts unexpected
 * infrastructure failures into a controlled application error.
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    /**
     * Detailed diagnostics remain server-side.
     *
     * Story 1.3 will replace this with structured logging
     * and correlation identifiers.
     */
    console.error("EventHub database operation failed:", error);

    throw new DatabaseUnavailableError();
  }
}
