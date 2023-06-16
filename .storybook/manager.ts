import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming/create'

const THEME = create({
  base: 'dark',
  brandTitle: 'Dashup',
  brandUrl: 'https://github.com/builtbyedgar/dashup/',
  brandImage: process.env.ASSETS_URL + '/sb-logo.png',
  brandTarget: '_self',
  fontBase: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  fontCode: 'monospace',

  //
  // colorPrimary: '#3A10E5',
  // colorSecondary: '#585C6D',

  // UI
  // appBg: '#ffffff',
  // appContentBg: '#ffffff',
  // appBorderColor: '#585C6D',
  // appBorderRadius: 2,

  // Text colors
  // textColor: '#10162F',
  // textInverseColor: '#ffffff',

  // Toolbar default and active colors
  // barTextColor: '#9E9E9E',
  // barSelectedColor: '#585C6D',
  // barBg: '#ffffff',

  // Form colors
  // inputBg: '#ffffff',
  // inputBorder: '#10162F',
  // inputTextColor: '#10162F',
  // inputBorderRadius: 2,
})

addons.setConfig({
  theme: THEME,
})
