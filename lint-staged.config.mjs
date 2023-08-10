import path from "path"

/**
 * @param {string[]} filenames
 */
const buildEslintCommand = (filenames) =>
  `cross-env SKIP_ENV_VALIDATION=true next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`

const config = {
  "*.{ts,tsx,js,cjs,mjs}": [buildEslintCommand, "pnpm typecheck"],
  "**/*.{ts,tsx,mdx,js,cjs,mjs}": "pnpm format:write",
}

export default config
