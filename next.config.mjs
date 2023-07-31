import BundleAnalyzer from "@next/bundle-analyzer"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const config = {
  // webpack: (config, _) => {
  //   config.externals.push({
  //     "utf-8-validate": "commonjs utf-8-validate",
  //     bufferutil: "commonjs bufferutil",
  //     encoding: "commonjs encoding",
  //   })
  //   return config
  // },
  images: {
    domains: ["uploadthing.com", "source.unsplash.com"],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
}

// export default config

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withBundleAnalyzer(config)
