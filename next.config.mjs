import BundleAnalyzer from "@next/bundle-analyzer"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * Current Workaround #https://github.com/vercel/next.js/issues/44273
   * @param {Object} config
   * @param {Object[]} config.externals
   * @returns {Object}
   */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        encoding: "commonjs encoding",
      })
    }

    return config
  },

  images: {
    domains: ["uploadthing.com", "source.unsplash.com", "utfs.io"],
  },
  experimental: {
    // typedRoutes: true,
    serverActions: true,
    // serverComponentsExternalPackages: ["better-sqlite3"],
  },

  /** Seperate CI pipeline for linting and typechecking in github actions */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

// export default config

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withBundleAnalyzer(config)

// TODO: Integrate MillionJS
