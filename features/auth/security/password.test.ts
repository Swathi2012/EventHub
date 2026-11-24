import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hashPassword,
  PASSWORD_HASH_OPTIONS,
  verifyPassword,
} from "./password";

const TEST_PASSWORD =
  "TestPassword123!";

describe("password security", () => {
  it("creates an Argon2id encoded hash", async () => {
    const passwordHash =
      await hashPassword(
        TEST_PASSWORD,
      );

    expect(
      passwordHash.startsWith(
        "$argon2id$",
      ),
    ).toBe(true);

    expect(passwordHash).not.toBe(
      TEST_PASSWORD,
    );

    expect(passwordHash).not.toContain(
      TEST_PASSWORD,
    );
  });

  it("uses the approved password-hashing configuration", () => {
    expect(
      PASSWORD_HASH_OPTIONS,
    ).toEqual({
      type: 2,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  });

  it("verifies the correct password", async () => {
    const passwordHash =
      await hashPassword(
        TEST_PASSWORD,
      );

    const isValid =
      await verifyPassword(
        passwordHash,
        TEST_PASSWORD,
      );

    expect(isValid).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const passwordHash =
      await hashPassword(
        TEST_PASSWORD,
      );

    const isValid =
      await verifyPassword(
        passwordHash,
        "WrongPassword123!",
      );

    expect(isValid).toBe(false);
  });

  it("creates different salted hashes for the same password", async () => {
    const firstHash =
      await hashPassword(
        TEST_PASSWORD,
      );

    const secondHash =
      await hashPassword(
        TEST_PASSWORD,
      );

    expect(firstHash).not.toBe(
      secondHash,
    );

    await expect(
      verifyPassword(
        firstHash,
        TEST_PASSWORD,
      ),
    ).resolves.toBe(true);

    await expect(
      verifyPassword(
        secondHash,
        TEST_PASSWORD,
      ),
    ).resolves.toBe(true);
  });

  it("rejects a malformed password hash", async () => {
    await expect(
      verifyPassword(
        "invalid-password-hash",
        TEST_PASSWORD,
      ),
    ).rejects.toThrow();
  });
});
