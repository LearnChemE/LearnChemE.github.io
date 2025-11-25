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
    environment: 'node',
    globals: true,
    setupFiles: './src/setupTests.ts',
    reporters: ['dot']
  },
  assetsInclude: ['**/*.glb','**/*.gltf','**/*.vert','**/*.frag','**/*.glsl']
})
