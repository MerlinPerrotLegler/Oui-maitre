/* eslint-env node */
module.exports = {
  root: true,
  env: { node: true, es2021: true, browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: [
      "./apps/*/tsconfig.json"
    ]
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: ["apps/*/tsconfig.json"]
      }
    }
  },
  rules: {
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ]
  },
  ignorePatterns: [
    "**/dist/**",
    "**/node_modules/**"
  ]
};

