import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(() => {
  const singlefile = process.env.BUILD_SINGLEFILE === 'true'
  console.log(`Vite config: singlefile=${singlefile}`)
  
  const plugins: any[] = [solid()];
  if (singlefile) {
    plugins.push(viteSingleFile());
  }

  return {
    base: './', // or ""
    plugins: plugins,
    outDir: singlefile ? 'dist-singlefile' : 'dist',
  }
});
