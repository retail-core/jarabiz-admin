import { DEFAULT_UNIT, type ProductFormValues } from './schema'
import type { Product } from './types'

export function getDefaultValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? '',
    barcode: product?.barcode ?? '',
    categoryId: product?.category[0]?.id ?? '',
    brandId: product?.brand.id ?? '',
    nafdacRegNo: product?.nafdac_regno ?? '',
    manufacturer: product?.manufacturer ?? '',
    image: null,
    // The backend doesn't return units yet, so edit starts from one default base unit.
    units: [{ ...DEFAULT_UNIT }],
  }
}