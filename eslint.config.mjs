import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default {
  languageOptions: {
    globals: {
      ...globals.node,  // Include all Node.js globals
      ...globals.jest,  // Add Jest globals
    },
    parserOptions: {
      ecmaVersion: 12,  // ECMAScript 2021 syntax
      sourceType: 'module',  // Allows ECMAScript modules (import/export)
    },
  },
  rules: {
    'no-undef': 'error', // Error for undefined variables
    'no-unused-vars': 'warn', // Warn about unused variables
    'eqeqeq': 'error', // Enforce strict equality
    // Add any other rules here
  },
};
