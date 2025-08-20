import { defineConfig } from "vite";

export default defineConfig({
  base: './', // or ""
  build: {
    // Other build options
    outDir: "dist",
    sourcemap: true
  },
});