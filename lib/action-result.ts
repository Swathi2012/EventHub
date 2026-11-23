import type { ErrorCode } from "../server/errors/error-codes";

import type { FieldErrors } from "../server/errors/application-error";

export type PublicError = {
  code: ErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
  correlationId?: string;
};

export type ActionSuccess<T> = {
  ok: true;
  data: T;
};

export type ActionFailure = {
  ok: false;
  error: PublicError;
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export function actionSuccess<T>(data: T): ActionSuccess<T> {
  return {
    ok: true,
    data,
  };
}
export function actionFailure(error: PublicError): ActionFailure {
  return {
    ok: false,
    error,
  };
}
