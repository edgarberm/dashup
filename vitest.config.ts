import terser from '@rollup/plugin-terser'
// import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
// import glob from 'glob'
import { defineConfig } from 'vitest/config'

// const components = glob.sync('src/components/**/*.tsx')
// const types = glob.sync('src/components/**/*.d.ts')

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
        '_templates',
        '.storybook',
        'coverage',
        'dist',
        'node_modules',
        'stories',
        'test',
        'src/index.ts',
        'src/**/*/config.ts',
        'src/**/*/index.ts',
        'src/**/*/types.d.ts',
        'src/config',
        'src/styles',
      ],
    },
  },
  build: {
    // cssCodeSplit: true,
    // cssMinify: true,
    // sourcemap: true,
    lib: {
      entry: '/dist/index.js',
      name: 'beats',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      input: '/src/index.ts',
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      plugins: [
        typescript({
          exclude: ['./stories/**/*.(ts|tsx)', './test/**/*.(ts|tsx)'],
          declaration: true,
          declarationDir: 'dist/types',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
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
          // postcss({
          //   modules: true,
          //   // modules: {},
          //   minimize: true,
          //   sourceMap: 'inline',
          // }),
        ],
      },
      // output: [
      //   {
      //     dir: 'dist',
      //     // file: 'dist/index.esm.js',
      //     esModule: true,
      //     sourcemap: true,
      //     name: 'beats',
      //     format: 'es',
      //     inlineDynamicImports: false,
      //   },
      //   {
      //     dir: 'dist',
      //     // file: 'dist/index.esm.min.js',
      //     compact: true,
      //     esModule: true,
      //     sourcemap: true,
      //     name: 'beats',
      //     format: 'es',
      //     inlineDynamicImports: false,
      //     plugins: [terser()],
      //   },
      // ],
    },
  },
})
