export interface ProductUnit {
  id: string
  label: string
  qty_per_unit: number
  barcode: string | null
  is_base: boolean
}

export interface Product {
  id: string
  name: string
  category: { id: string; name: string }[]
  image_url: string
  units: ProductUnit[]
}

export interface ProductList {
  items: Product[]
  total: number
}