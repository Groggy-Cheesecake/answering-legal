module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [1, 180, 4],
    semi: [2, 'never'],
    'vue/valid-v-model': 'off',
    'no-nested-ternary': 'off',
    'prefer-destructuring': 'off',
  },
}
