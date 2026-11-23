export const REDACTED_VALUE =
  "[REDACTED]";

export const SENSITIVE_KEYS = [
  "password",
  "passwordHash",
  "token",
  "sessionToken",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "databaseUrl",
  "shadowDatabaseUrl",
] as const;

function normalizeKey(
  key: string,
): string {
  return key
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

const NORMALIZED_SENSITIVE_KEYS =
  new Set(
    SENSITIVE_KEYS.map(
      (key) => normalizeKey(key),
    ),
  );

export function isSensitiveKey(
  key: string,
): boolean {
  return NORMALIZED_SENSITIVE_KEYS.has(
    normalizeKey(key),
  );
}

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

export function redactSensitiveData(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      redactSensitiveData(item),
    );
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const redactedEntries =
    Object.entries(value).map(
      ([key, propertyValue]) => {
        if (isSensitiveKey(key)) {
          return [
            key,
            REDACTED_VALUE,
          ];
        }

        return [
          key,
          redactSensitiveData(
            propertyValue,
          ),
        ];
      },
    );

  return Object.fromEntries(
    redactedEntries,
  );
}
