// "lint-staged": {
//   "**/*.{ts,tsx,mdx,js,cjs,mjs}": "pnpm format:check",
//   "src/**/*.{ts,tsx,js,cjs,mjs}": [
//     "cross-env SKIP_ENV_VALIDATION=true next lint",
//     "tsc --noEmit"
//   ]
// },

// const path = require('path')

import path from "path"

/**
 * @param {string[]} filenames
 */
const buildEslintCommand = (filenames) =>
  `cross-env SKIP_ENV_VALIDATION=true next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`

const config = {
  // "*.{ts,tsx}": "pnpm typecheck",
  "**/*.{ts,tsx}?(x)": () => "tsc -p tsconfig.json --noEmit",
  "*.{ts,tsx,js,cjs,mjs}": [buildEslintCommand],
  "**/*.{ts,tsx,mdx,js,cjs,mjs}": "pnpm format:check",
}

export default config
