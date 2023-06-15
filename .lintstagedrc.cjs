module.exports = {
  $schema: 'http://json.schemastore.org/lintstagedrc.schema',
  '*.+(ts|tsx)': ['npm run lint'],
  '*.+(ts|tsx)': ['npm run format'],
}
