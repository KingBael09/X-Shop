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
