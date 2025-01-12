import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import sort from 'eslint-plugin-sort'
import fs from 'node:fs'
import withNuxt from './.nuxt/eslint.config.mjs'

const prettierConf = JSON.parse(fs.readFileSync('./.prettierrc', 'utf-8'))

export default withNuxt({
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'prefer-const': 'error',
    'prettier/prettier': [
      'error',
      {
        ...prettierConf,
      },
    ],
    'sort/destructuring-properties': ['error', { caseSensitive: false, natural: true }],
    'sort/export-members': ['error', { caseSensitive: false, natural: true }],
    'sort/exports': [
      'error',
      {
        caseSensitive: false,
        groups: [],
        natural: true,
        typeOrder: 'preserve',
      },
    ],
    'sort/imports': [
      'error',
      {
        caseSensitive: false,
        groups: [
          { order: 10, type: 'side-effect' },
          { order: 40, regex: '\\.(png|jpg|svg)$' },
          { order: 20, type: 'dependency' },
          { order: 30, type: 'other' },
          { order: 60, type: 'type' },
        ],
        natural: true,
        separator: '',
        typeOrder: 'last',
      },
    ],
    'sort/type-properties': ['error', { caseSensitive: false, natural: true }],
  },
})
  .prepend(eslintPluginPrettierRecommended)
  .prepend(eslintConfigPrettier)
  .prepend(sort.configs['flat/recommended'])
