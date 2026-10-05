import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    /**
     * Database tests run in Node.js, not a simulated browser.
     */
    environment: "node",

    /**
     * Only database integration tests are included.
     */
    include: ["tests/integration/**/*.test.ts"],
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),

      /**
       * Allow server-only modules to be loaded by Vitest's
       * Node.js integration-test environment.
       */
      "server-only": fileURLToPath(
        new URL("./tests/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
});
