import { afterAll, describe, expect, it } from "vitest";

import { eventCategorySeed } from "../../prisma/seed-data";
import { seedEventCategories } from "../../prisma/seed-categories";
import { prisma } from "../../server/db/prisma";

describe("EventHub category seed", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("seeds categories idempotently", async () => {
    await seedEventCategories(prisma);
    await seedEventCategories(prisma);

    const slugs = eventCategorySeed.map(
      (category) => category.slug,
    );

    const count = await prisma.eventCategory.count({
      where: {
        slug: {
          in: [...slugs],
        },
      },
    });

    expect(count).toBe(eventCategorySeed.length);
  });
});
