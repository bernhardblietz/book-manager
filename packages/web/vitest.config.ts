import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { vitest } from "vitest";
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    browser: {
      enabled: true,
      provider: playwright() as any,
      instances: [
        { browser: 'chromium' },
      ],
    },
    globals: true
  },
  resolve: {
    tsconfigPaths: true
  }
});
