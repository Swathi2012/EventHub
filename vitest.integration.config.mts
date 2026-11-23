import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Prisma and MySQL tests run in Node.js.
    environment: "node",

    // Run only database integration tests.
    include: ["tests/integration/**/*.test.ts"],

    // MySQL tests share one local database.
    // Run test files sequentially to avoid connection conflicts.
    fileParallelism: false,

    // Database connection and cleanup may take longer
    // than Vitest's default 5-second timeout.
    testTimeout: 15_000,

    hookTimeout: 15_000,
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),

      // Test-only replacement for Next.js server-only.
      "server-only": fileURLToPath(
        new URL("./tests/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
});
