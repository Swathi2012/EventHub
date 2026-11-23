import type { ErrorCode } from "./error-codes";

export type FieldErrors = Record<
  string,
  string[]
>;

export type ApplicationErrorOptions = {
  code: ErrorCode;
  message: string;
  statusCode: number;
  fieldErrors?: FieldErrors;
  cause?: unknown;
};

export class ApplicationError extends Error {
  readonly code: ErrorCode;

  readonly statusCode: number;

  readonly fieldErrors?: FieldErrors;

  constructor(
    options: ApplicationErrorOptions,
  ) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = "ApplicationError";
    this.code = options.code;
    this.statusCode = options.statusCode;

    if (options.fieldErrors) {
      this.fieldErrors =
        options.fieldErrors;
    }
  }
}
