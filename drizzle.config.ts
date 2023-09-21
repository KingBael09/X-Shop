import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config()

const config = {
  schema: "./src/lib/db/schema.ts",
  out: "./.drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  // tablesFilter: ["x_shop_*"],
  verbose: true,
  strict: true,
} satisfies Config

export default config
