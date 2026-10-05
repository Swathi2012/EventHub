import { fileURLToPath, URL } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",

    setupFiles: ["./vitest.setup.ts"],

    /**
     * Normal test execution must not load database integration tests.
     *
     * Database tests are run separately through `npm run test:db`.
     */
    exclude: [...configDefaults.exclude, "tests/integration/**"],
  },

  resolve: {
    alias: {
      /**
       * EventHub uses root-level application folders.
       */
      "@": fileURLToPath(new URL("./", import.meta.url)),

      /**
       * Test-only replacement for the Next.js server-only marker.
       *
       * Production code still uses the real server-only package.
       */
      "server-only": fileURLToPath(
        new URL("./tests/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
});
