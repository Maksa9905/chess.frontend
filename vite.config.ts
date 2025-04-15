import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filePath = fileURLToPath(import.meta.url)
const __dirname = dirname(__filePath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, './src/components/index.ts'),
      name: 'chess.widget',
      fileName: 'chess.widget',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
    },
  },
})
