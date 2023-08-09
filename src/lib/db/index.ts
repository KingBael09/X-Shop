import { env } from "@/env.mjs"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

/**
 * In SQLite
 * ```ts
 * const db = new Database(":memory")
 * ```
 */
export const connection = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(connection, { schema })
