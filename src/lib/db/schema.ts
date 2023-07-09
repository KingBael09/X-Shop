import type { CartItem, Rating, StoredFile } from "@/types"
import { relations, type InferModel } from "drizzle-orm"
import { blob, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const stores = sqliteTable("stores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }),
})

export const storeRelations = relations(stores, ({ many }) => ({
  products: many(products),
}))

export type Store = InferModel<typeof stores>

export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  images: blob("images", { mode: "json" })
    .$type<StoredFile[] | null>()
    .default(null),
  price: real("price").notNull().default(0),
  rating: integer("rating").$type<Rating>().notNull().default(0),
  tags: blob("tags", { mode: "json" }).$type<string[] | null>().default(null),
  categoryId: integer("categoryId").notNull(),
  //   subcategory: text("subcategory"),
  inventory: integer("inventory").notNull().default(0),
  storeId: integer("storeId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
})

export type Product = InferModel<typeof products>

export const productRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export const categories = sqliteTable("categories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
})

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const carts = sqliteTable("carts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  items: blob("items", { mode: "json" })
    .$type<CartItem[] | null>()
    .default(null),
  createdAt: integer("createdAt", { mode: "timestamp" }),
})

export type Cart = InferModel<typeof carts>
