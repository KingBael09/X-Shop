import { type FileWithPath } from "react-dropzone"

export interface LayoutProps {
  children: React.ReactNode
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5

export interface CartItem {
  productId: string
  quantity: number
  productSubCatagory?: string | null
}

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
