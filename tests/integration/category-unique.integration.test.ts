import { afterAll, describe, expect, it } from "vitest";

import { prisma } from "../../server/db/prisma";

describe("EventHub category constraints", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects duplicate category slugs", async () => {
    const slug = "integration-unique-category";

    await prisma.eventCategory.deleteMany({
      where: {
        slug,
      },
    });

    try {
      await prisma.eventCategory.create({
        data: {
          name: "Integration Category One",
          slug,
          sortOrder: 1000,
        },
      });

      await expect(
        prisma.eventCategory.create({
          data: {
            name: "Integration Category Two",
            slug,
            sortOrder: 1001,
          },
        }),
      ).rejects.toThrow();
    } finally {
      await prisma.eventCategory.deleteMany({
        where: {
          slug,
        },
      });
    }
  });
});
