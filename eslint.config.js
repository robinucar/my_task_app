import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['node_modules', 'dist', 'coverage'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
