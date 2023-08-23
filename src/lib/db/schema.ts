import type { CartItem, OrderItem, Rating, StoredFile } from "@/types"
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm"
import { blob, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

import type { PaymentType } from "../validations/checkout"

export const stores = sqliteTable("stores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const storeRelations = relations(stores, ({ many }) => ({
  products: many(products),
}))

export type Store = InferSelectModel<typeof stores>
export type InsertStore = InferInsertModel<typeof stores>

export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  images: blob("images", { mode: "json" })
    .$type<StoredFile[] | null>()
    .default(null),
  price: real("price").notNull().default(0),
  rating: integer("rating").$type<Rating>().notNull().default(0),
  tags: blob("tags", { mode: "json" }).$type<string[] | null>().default(null),
  categoryId: integer("categoryId").notNull(),
  subcategory: text("subcategory"),
  inventory: integer("inventory").notNull().default(0),
  storeId: integer("storeId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type Product = InferSelectModel<typeof products>
export type InsertProduct = InferInsertModel<typeof products>

export const productRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export const categories = sqliteTable("categories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  subcategories: blob("subcategories", { mode: "json" })
    .$type<string[] | null>()
    .default(null),
})

export type Category = InferSelectModel<typeof categories>
export type InsertCategory = InferInsertModel<typeof categories>

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const carts = sqliteTable("carts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull().unique(),
  items: blob("items", { mode: "json" })
    .$type<CartItem[] | null>()
    .default(null),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type Cart = InferSelectModel<typeof carts>
export type InsertCart = InferInsertModel<typeof carts>

export const orders = sqliteTable("orders", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  items: blob("items", { mode: "json" }).$type<OrderItem[]>().notNull(),
  storeIds: blob("storeIds", { mode: "json" }).$type<number[]>().notNull(),
  username: text("username").notNull(),
  mail: text("mail").notNull(),
  paymentMode: text("paymentMode").$type<PaymentType>().notNull(),
  address: text("address").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type Order = InferSelectModel<typeof orders>
export type InsertOrder = InferInsertModel<typeof orders>
