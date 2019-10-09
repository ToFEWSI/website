module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'html',
    'flowtype-errors',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'flowtype-errors/show-errors': 2
  },
}
