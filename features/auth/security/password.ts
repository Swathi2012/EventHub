import "server-only";

import * as argon2 from "argon2";

export const PASSWORD_HASH_OPTIONS = {
  type: argon2.argon2id,

  memoryCost: 19 * 1024,

  timeCost: 2,

  parallelism: 1,

  hashLength: 32,
} as const;

export async function hashPassword(
  password: string,
): Promise<string> {
  return argon2.hash(
    password,
    PASSWORD_HASH_OPTIONS,
  );
}

export async function verifyPassword(
  passwordHash: string,
  candidatePassword: string,
): Promise<boolean> {
  return argon2.verify(
    passwordHash,
    candidatePassword,
  );
}
