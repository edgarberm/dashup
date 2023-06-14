module.exports = {
  $schema: 'https://json.schemastore.org/eslintrc',
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    amd: true,
    node: true,
    browser: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'prettier/prettier': [1],
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'plugin:storybook/recommended',
    'plugin:storybook/recommended',
    'plugin:storybook/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
