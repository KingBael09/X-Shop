import { env } from "@/env.mjs"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

export const connection = createClient({
  url: env.DATABASE_URL,
  // authToken: env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(connection, { schema })
