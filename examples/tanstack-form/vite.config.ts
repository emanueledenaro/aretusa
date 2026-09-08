import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), ...(process.env.VITEST ? [] : [tailwind()])],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-form",
      "radix-ui",
      "react-day-picker",
      "lucide-react",
    ],
  },
  server: { fs: { allow: ["../.."] } },
  test: {
    environment: "jsdom",
    setupFiles: ["./setup.ts"],
    include: ["./*.test.tsx"],
  },
});
