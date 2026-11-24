import {
  Prisma,
} from "../../generated/prisma/client";

export function isPrismaUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof
      Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export function isUniqueConstraintTarget(
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): boolean {
  const target =
    error.meta?.target;

  if (Array.isArray(target)) {
    return target.some(
      (value) =>
        String(value) === field,
    );
  }

  if (
    typeof target === "string"
  ) {
    return target.includes(field);
  }

  return false;
}

export function isEmailNormalizedConflict(
  error: unknown,
): boolean {
  return (
    isPrismaUniqueConstraintError(
      error,
    ) &&
    isUniqueConstraintTarget(
      error,
      "emailNormalized",
    )
  );
}
