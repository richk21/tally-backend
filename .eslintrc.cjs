module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier", "unused-imports"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],

    // Let unused-imports handle unused vars
    "@typescript-eslint/no-unused-vars": "off",

    // Remove unused imports automatically
    "unused-imports/no-unused-imports": "error",

    // Warn about unused variables, allow variables starting with "_"
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    "@typescript-eslint/no-explicit-any": "off",
  },
};
