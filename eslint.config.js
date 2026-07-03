const expoConfig = require('eslint-config-expo/flat')
const eslintConfigPrettier = require('eslint-config-prettier')
const reactNative = require('eslint-plugin-react-native')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  ...expoConfig,
  eslintConfigPrettier,
  {
    plugins: { 'react-native': reactNative },
    rules: {
      'react-native/no-unused-styles': 'error',
      'react-native/no-color-literals': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/no-raw-text': ['error', { skip: ['Typography'] }],
    },
  },
  {
    // Typography looks up its style via `styles[variant]`, which
    // no-unused-styles can't follow (it only tracks static `styles.x` access).
    files: ['src/components/Typography.tsx'],
    rules: {
      'react-native/no-unused-styles': 'off',
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
])
