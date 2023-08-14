import type { FileWithPath } from "react-dropzone"

import type { ZCartItemSchema } from "@/lib/validations/cart"

export interface LayoutProps {
  children: React.ReactNode
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5

export type CartItem = ZCartItemSchema

export type OrderItem = Omit<CartItem, "productSubcategory">

export type FileWithPreview = FileWithPath & {
  preview: string
}

export type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

/**
 * Utility type to extract all inheretances
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

// TODO: Using server actions on a page currently disables static generation for that page
