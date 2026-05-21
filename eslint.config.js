import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'scripts/**', 'server/**'] },
  {
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.vue'],
    extends: [
      ...pluginVue.configs['flat/essential'],
      ...vueTsEslintConfig(),
    ],
  },
)
