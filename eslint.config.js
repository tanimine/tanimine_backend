import typescriptEslint from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    plugins: {
      // You’d typically use one of the following two:
      // typescriptEslint: typescriptEslint,
      // typescriptEslint,
      // But in this example we give it another name.
      // It might be tempting to use something shorter like “ts”:
      ts: typescriptEslint // 🚨 Don’t do this!
    },
    rules: {
      // With eslintrc, this is _always_ called:
      // @typescript-eslint/indent
      // But in eslint.config.js (flat config), the name chosen above in `plugins` is used.
      'ts/indent': 'error' // 🚨 Don’t do this!
    }
  },
  eslintConfigPrettier
]
