import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // or ""
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    // Other build options
    outDir: "dist",
    sourcemap: true
  },
  assetsInclude: ['**/*.glb','**/*.gltf','**/*.vert','**/*.frag','**/*.glsl']
})
