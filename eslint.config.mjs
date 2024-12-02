import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default {
  languageOptions: {
    globals: {
      ...globals.node,  // Include all Node.js globals (e.g., require, module)
      structuredClone: 'readonly',  // Add structuredClone as a global variable
    },
    parserOptions: {
      ecmaVersion: 12,  // ECMAScript 2021 syntax
      sourceType: 'module',  // Allows ECMAScript modules (import/export)
    },
  },
  rules: {
    'no-undef': 'error',  // example rule, ensure undefined variables are caught
    'no-unused-vars': 'warn',  // warn about unused variables
    'eqeqeq': 'error',  // enforce strict equality
    // You can add more recommended rules manually or according to your needs
  },
};
