module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Customize rules as needed
    'no-console': 'off',
    'no-underscore-dangle': 'off',
  },
};
