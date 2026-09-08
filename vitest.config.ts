import { defineConfig } from "vitest/config";
export default defineConfig({
  // Standalone examples carry their own node_modules; keep one React and one form library instance.
  resolve: {
    dedupe: ["react", "react-dom", "react-hook-form", "@tanstack/react-form", "@formisch/react", "valibot", "radix-ui", "react-day-picker", "lucide-react"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.tsx"],
    setupFiles: ["./tests/setup.ts"],
  },
});
