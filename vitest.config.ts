import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: '.',
    environment: 'happy-dom',
    setupFiles: ['./__test__/setup.ts'],
    include: ['./__test__/*.{test,spec}.{ts,tsx}'],
    css: false,
    // coverage: {
    //   all: true,
    //   clean: true,
    //   exclude: [],
    // },
  },
})
