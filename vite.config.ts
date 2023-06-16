import { defineConfig } from 'vitest/config'

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
})
