// @ts-check

/* eslint-env node */
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import postcssDts from 'postcss-typescript-d-ts'
import copy from 'rollup-plugin-copy'
import fs from 'fs'
import path from 'path'

const distDir = path.resolve('./dist')
const srcDir = path.resolve('./src')

/**
 * Rollup configuration to build the main bundle.
 * @type {import('rollup').RollupOptions}
 */
const mainConfig = {
  input: `src/index.ts`,
  output: [
    {
      file: `dist/index.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `dist/index.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/index.min.js`,
      format: 'umd',
      name: 'Dashboard',
      plugins: [terser()],
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'react/jsx-runtime',
      },
    },
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json',
      declaration: false,
    }),
    postcss({
      extract: 'style.css',
      sourceMap: true,
      plugins: [
        postcssDts({
          writeFile: ({ content }) => {
            if (!fs.existsSync(distDir)) fs.mkdirSync(distDir)
            if (!fs.existsSync(`${srcDir}/styles/style.css.d.ts`)) {
              fs.writeFileSync(`${srcDir}/styles/style.css.d.ts`, content)
            }
            fs.writeFileSync(`dist/style.css.d.ts`, content)
          },
        }),
      ],
    }),
    // Create module.css
    copy({
      targets: [
        {
          src: './src/styles/index.css',
          dest: './dist',
          rename: 'style.module.css',
          transform: (contents) =>
            contents
              .toString()
              .replace(/\.dashup-/g, '.')
              .replace(/\.dashup/g, '.root'),
        },
        {
          src: './src/style.css.d.ts',
          dest: './dist',
          rename: 'style.module.css.d.ts',
          transform: (contents) =>
            contents
              .toString()
              .replace(/dashup-/g, '')
              .replace(/dashup/g, 'root'),
        },
      ],
    }),
  ],
}

/**
 * Rollup configuration to build the type declaration file.
 * @type {import('rollup').RollupOptions}
 */
export const dtsConfig = {
  input: `src/index.ts`,
  output: [{ file: `dist/index.d.ts`, format: 'es' }],
  plugins: [
    dts({
      tsconfig: './tsconfig.build.json',
      compilerOptions: {
        preserveSymlinks: false,
      },
    }),
  ],
}

export default [mainConfig, dtsConfig]
