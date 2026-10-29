import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
      include: [
        "app/actions/**",
        "lib/**",
        "helpers/**",
        "components/**",
      ],
      exclude: ["**/*.d.ts", "**/ui/**", "app/api/**"],
    },
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
