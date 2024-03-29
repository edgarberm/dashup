import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    // disableTelemetry: true,
    builder: '@storybook/builder-vite',
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../assets']
}

export default config
