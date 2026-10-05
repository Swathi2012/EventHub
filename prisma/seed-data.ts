/**
 * Stable reference categories required by EventHub.
 *
 * These are application reference records.
 * They are not fictional users or events.
 */
export const eventCategorySeed = [
  {
    name: "Technology",
    slug: "technology",
    description: "Technology, software, IT, and digital innovation events.",
    sortOrder: 10,
  },
  {
    name: "Business",
    slug: "business",
    description:
      "Business, entrepreneurship, leadership, and networking events.",
    sortOrder: 20,
  },
  {
    name: "Education",
    slug: "education",
    description: "Education, academic, learning, and training events.",
    sortOrder: 30,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports, fitness, wellness, and active-lifestyle events.",
    sortOrder: 40,
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Music, cultural, arts, and entertainment events.",
    sortOrder: 50,
  },
  {
    name: "Community",
    slug: "community",
    description: "Community gatherings, social initiatives, and local events.",
    sortOrder: 60,
  },
  {
    name: "Workshop",
    slug: "workshop",
    description: "Hands-on workshops and practical learning sessions.",
    sortOrder: 70,
  },
] as const;
