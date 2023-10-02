import React from 'react'
import type { Preview } from '@storybook/react'
import './styles.scss'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview

// @ts-ignore
export const decorators = [(Story) => <Story />]
