import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/*', 'test/**', 'dist/*'] },
  eslint.configs.recommended,
  {
    name: 'typescript-eslint',
    files: ['*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    },
  },
  { languageOptions: { globals: { ...globals.node } } },
  prettier,
);
