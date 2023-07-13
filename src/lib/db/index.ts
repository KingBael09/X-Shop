import { env } from "@/env.mjs"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

export const connection = createClient({
  url: env.DATABASE_URL,
  //   authToken: env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(connection, { schema })

// ! NEW Iter

// import { env } from "@/env.mjs"
// import { Database } from "@libsql/sqlite3"
// import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql"

// import * as schema from "./schema"

// const sqlite = new Database(env.DATABASE_URL)

// export const db = drizzle(sqlite, { schema })

// ! New Iter

// import { env } from "@/env.mjs"
// import Database from "better-sqlite3"
// import { drizzle } from "drizzle-orm/better-sqlite3"

// import * as schema from "./schema"

// const sqlite = new Database(env.DATABASE_URL)
// export const db = drizzle(sqlite, { schema })
