export interface Product {
  id: string
  name: string
  barcode: string
  brand: { id: string; name: string }
  category: { id: string; name: string }[]
  manufacturer: string | null
  image_url: string
  nafdac_regno: string | null
}

export interface ProductList {
  items: Product[]
  total: number
}