import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    globals: true,
    root: '.',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    include: ['./test/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    coverage: {
      all: true,
      clean: true,
      exclude: [
        '**.*.*',
        '.storybook',
        'assets',
        'dist',
        'node_modules',
        'stories',
        'test',
        'src/index.ts',
        'src/styles',
        'src/types.d.ts',
      ],
    },
  },
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    sourcemap: 'inline',
    lib: {
      entry: '/dist/index.js',
      name: 'redashify',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      input: '/src/index.ts',
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      plugins: [
        react({
          jsxRuntime: 'classic'
        }),
      ],
      output: {
        sourcemap: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        plugins: [
          terser(),
        ],
      },
    },
  },
})
