export const CIRCULAR_VALUE =
  "[CIRCULAR]";

export type SerializedError = {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
};

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function serializeValue(
  value: unknown,
  seen: WeakSet<object>,
): unknown {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }

  if (seen.has(value)) {
    return CIRCULAR_VALUE;
  }

  seen.add(value);

  if (value instanceof Error) {
    const serializedError:
      SerializedError = {
        name: value.name,
        message: value.message,
      };

    if (value.stack) {
      serializedError.stack =
        value.stack;
    }

    if (value.cause !== undefined) {
      serializedError.cause =
        serializeValue(
          value.cause,
          seen,
        );
    }

    return serializedError;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      serializeValue(item, seen),
    );
  }

  if (isPlainObject(value)) {
    const entries =
      Object.entries(value).map(
        ([key, propertyValue]) => [
          key,
          serializeValue(
            propertyValue,
            seen,
          ),
        ],
      );

    return Object.fromEntries(entries);
  }

  return String(value);
}

export function serializeLogValue(
  value: unknown,
): unknown {
  return serializeValue(
    value,
    new WeakSet<object>(),
  );
}
