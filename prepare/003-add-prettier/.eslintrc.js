module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es2020: true
  },
  // 'standard',
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended', 'prettier/standard'],
  rules: {}
}
