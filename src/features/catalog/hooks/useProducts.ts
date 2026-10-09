import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiError } from '@/shared/lib/api'
import { PRODUCT_ENDPOINTS } from '../api/endpoints'
import type { Product, ProductList } from '../types'
import type { ProductFormValues } from '../schema'

export const productKeys = {
  all: ['products'] as const,
  catalog: ['products', 'catalog'] as const,
}

/**
 * STOPGAP: the backend ignores `search`, `pageSize` and `pageIndex` on the list endpoint,
 * so the whole catalog is fetched once and searched/paged in the browser.
 * OK for hundreds of products, not for 10k+. When the backend honors those params,
 * change only this block: send them in `params`, return { items, total } from the response,
 * and put the page params in the query key. Pages and components stay untouched.
 */
const FETCH_ALL_SIZE = 10000

const matches = (p: Product, term: string) =>
  p.name.toLowerCase().includes(term) ||
  p.barcode.toLowerCase().includes(term) ||
  p.brand.name.toLowerCase().includes(term) ||
  p.category.some((c) => c.name.toLowerCase().includes(term))

function useCatalog() {
  return useQuery({
    queryKey: productKeys.catalog,
    queryFn: async () => {
      const { data } = await api.get(PRODUCT_ENDPOINTS.list, {
        params: { pageSize: FETCH_ALL_SIZE },
      })
      return data.items as Product[]
    },
    staleTime: 60_000,
  })
}

interface ListParams {
  search?: string
  /** 0-based, matches the backend's convention. */
  pageIndex?: number
  pageSize?: number
}

export function useProducts({ search = '', pageIndex = 0, pageSize = 20 }: ListParams = {}) {
  const { data, ...query } = useCatalog()
  const term = search.trim().toLowerCase()

  const result = useMemo<ProductList | undefined>(() => {
    if (!data) return undefined
    const filtered = term ? data.filter((p) => matches(p, term)) : data
    const start = pageIndex * pageSize
    return { items: filtered.slice(start, start + pageSize), total: filtered.length }
  }, [data, term, pageIndex, pageSize])

  return { ...query, data: result }
}

/** Reads from the catalog cache, so opening the edit page makes no extra request. */
export function useProduct(id: string | undefined) {
  const { data, ...query } = useCatalog()
  const product = useMemo(() => data?.find((p) => p.id === id), [data, id])
  return { ...query, data: product }
}

/**
 * Maps form values to the backend's multipart contract.
 * NOTE: `units` is intentionally NOT sent. The backend doesn't support units yet.
 * When it does, append them here.
 */
function toFormData(values: ProductFormValues): FormData {
  const fd = new FormData()
  fd.append('name', values.name)
  fd.append('barcode', values.barcode)
  fd.append('category_id', values.categoryId)
  fd.append('brand_id', values.brandId)
  if (values.image) fd.append('imageFile', values.image)
  if (values.nafdacRegNo) fd.append('nafdac_regno', values.nafdacRegNo)
  if (values.manufacturer) fd.append('manufacturer', values.manufacturer)
  return fd
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductFormValues) =>
      api.post(PRODUCT_ENDPOINTS.list, toFormData(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product created')
    },
    onError: (error) => toast.error(getApiError(error).message),
  })
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductFormValues) =>
      api.put(PRODUCT_ENDPOINTS.detail(id), toFormData(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product updated')
    },
    onError: (error) => toast.error(getApiError(error).message),
  })
}