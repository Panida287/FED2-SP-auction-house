import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Browser-specific globals (e.g., window, document)
        ...globals.node,    // Node.js-specific globals (e.g., process, __dirname)
        ...globals.jest,    // Jest-specific globals (e.g., describe, test, expect)
      },
    },
  },
  pluginJs.configs.recommended, // Use ESLint's recommended rules
];
