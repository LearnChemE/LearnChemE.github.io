import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: './', // or ""
  plugins: [solid()],
  build: {
    // Other build options
    outDir: "dist",
    sourcemap: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts'
  },
  assetsInclude: ['**/*.glb','**/*.gltf','**/*.vert','**/*.frag','**/*.glsl']
})
