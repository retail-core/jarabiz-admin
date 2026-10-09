export const PRODUCT_ENDPOINTS = {
  list: '/product/v1/products',
  detail: (id: string) => `/product/v1/products/${id}`,
} as const