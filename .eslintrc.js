module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },

  rules: {
    'max-len': 0,
    'consistent-return': 0,
    'no-return-await': 0,
    'prefer-destructuring': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'func-names': 0,
    radix: 0,
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: 'req|res|next|val|props' },
    ],
    'no-console': 1,
    'spaced-comment': 0,
    'comma-dangle': 0,
  },
};
