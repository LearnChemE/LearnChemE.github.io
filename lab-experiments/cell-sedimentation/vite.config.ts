import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: './', // or ""
  plugins: [solid()],
  build: {
    // Other build options
    outDir: "dist",
    sourcemap: true
  },
  assetsInclude: ['**/*.glb','**/*.gltf','**/*.vert','**/*.frag','**/*.glsl']
})
