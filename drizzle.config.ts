import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config()

const config = {
  schema: "./src/lib/db/schema.ts",
  out: "./.drizzle",
  // ...(process.env.DATABASE_AUTH_TOKEN && process.env.NODE_ENV == "production"
  //   ? {
  //       driver: "turso",
  //       dbCredentials: {
  //         url: process.env.DATABASE_URL ?? "",
  //         authToken: process.env.DATABASE_AUTH_TOKEN,
  //       },
  //     }
  //   : {
  //       driver: "libsql",
  //       dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  //     }),
  driver: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL ?? "",
          authToken: process.env.DATABASE_AUTH_TOKEN,
        },
  verbose: true,
  strict: true,
} satisfies Config

export default config
