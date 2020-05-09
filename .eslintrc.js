module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'vue',
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'func-names': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'off',
    'no-use-before-define': 'off',
    'max-len': ["error", { "code": 120 }],
  },
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: ['package.json']
    }
  ]
};
