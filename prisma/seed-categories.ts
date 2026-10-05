import type { PrismaClient } from "../generated/prisma/client";

import { eventCategorySeed } from "./seed-data";

export async function seedEventCategories(
  prisma: PrismaClient,
): Promise<void> {
  for (const category of eventCategorySeed) {
    await prisma.eventCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        isActive: true,
        sortOrder: category.sortOrder,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: true,
        sortOrder: category.sortOrder,
      },
    });
  }
}