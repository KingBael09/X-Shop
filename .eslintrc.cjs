/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "tailwindcss"],
  // plugins: ["@typescript-eslint", "tailwindcss", "deprecation"],
  extends: [
    "prettier",
    "next/core-web-vitals",
    "plugin:@next/next/recommended",
    "plugin:deprecation/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // "@next/next/no-html-link-for-pages": "off",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/classnames-order": "error",
    // "deprecation/deprecation": "warn",
  },

  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
      config: "tailwind.config.ts",
      classRegex: "^(class(Name)?|tw)$",
    },
    next: {
      rootDir: true,
    },
  },
}

module.exports = config
