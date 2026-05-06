import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      'prettier/prettier': [
        'warn',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 120,
          endOfLine: 'auto',
        },
      ],

      semi: 'off',
    },
  },

  eslintConfigPrettier,
];