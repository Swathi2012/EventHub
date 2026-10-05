import { afterAll, describe, expect, it } from "vitest";

import { prisma } from "../../server/db/prisma";

describe("EventHub database integration", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects to MySQL through Prisma", async () => {
    const result = await prisma.$queryRawUnsafe<Array<{ connected: number }>>(
      "SELECT 1 AS connected",
    );

    expect(Number(result[0]?.connected)).toBe(1);
  });
});
