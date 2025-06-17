module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'serviceWorker'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'n/no-unsupported-features/node-builtins': 'off',
    'n/no-unsupported-features/es-syntax': 'off',
    'n/no-extraneous-import': 'off',
    'n/no-extraneous-require': 'off',
    'no-unsafe-optional-chaining': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
      },
    ],
  },
};
