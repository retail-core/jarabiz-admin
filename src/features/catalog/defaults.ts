import { DEFAULT_UNIT, type ProductFormValues } from "./schema";
import type { Product } from "./types";
import { isOjaBarcode } from './barcode'

export function getDefaultValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    categoryId: product?.category[0]?.id ?? "",
    image: null,
    hasBarcode: !product || !isOjaBarcode(product.units.find((u) => u.is_base)?.barcode ?? ''),
    units: product?.units.length
      ? product.units.map((u) => ({
          unitId: u.id,
          label: u.label,
          qtyPerUnit: u.qty_per_unit,
          isBase: u.is_base,
          barcode: u.barcode ?? "",
        }))
      : [{ ...DEFAULT_UNIT }],
  };
}
