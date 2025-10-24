import { defineConfig } from "vite";

export default defineConfig({
  base: './', // or ""
  build: {
    // Other build options
    outDir: "dist",
    sourcemap: true
  },
  assetsInclude: "**/*.docx",
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
});
