import { z } from 'zod'

export const MAX_UNITS = 4

export const unitSchema = z.object({
  label: z.string().trim().min(1, 'Enter a label'),
  qtyPerUnit: z
    .number({ error: 'Enter a quantity' })
    .int('Whole numbers only')
    .min(1, 'Minimum is 1'),
  isBase: z.boolean(),
})

/** requireImage: true on create, false on edit (existing image is kept). */
export const getProductSchema = (requireImage: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, 'Enter the product name'),
      barcode: z.string().trim().min(1, 'Enter the barcode'),
      categoryId: z.string().min(1, 'Select a category'),
      brandId: z.string().min(1, 'Select a brand'),
      nafdacRegNo: z.string().trim().optional(),
      manufacturer: z.string().trim().optional(),
      image: z.instanceof(File).nullable(),
      units: z
        .array(unitSchema)
        .min(1, 'Add at least one unit')
        .max(MAX_UNITS, `Maximum ${MAX_UNITS} units`),
    })
    .superRefine((data, ctx) => {
      if (requireImage && !data.image) {
        ctx.addIssue({ code: 'custom', path: ['image'], message: 'Add a product image' })
      }

      const baseCount = data.units.filter((u) => u.isBase).length
      if (baseCount !== 1) {
        ctx.addIssue({ code: 'custom', path: ['units'], message: 'Select exactly one base unit' })
      }

      const seen = new Set<string>()
      data.units.forEach((unit, i) => {
        if (unit.isBase && unit.qtyPerUnit !== 1) {
          ctx.addIssue({
            code: 'custom',
            path: ['units', i, 'qtyPerUnit'],
            message: 'Base unit must be 1',
          })
        }
        if (!unit.isBase && unit.qtyPerUnit < 2) {
          ctx.addIssue({
            code: 'custom',
            path: ['units', i, 'qtyPerUnit'],
            message: 'Must be more than 1',
          })
        }
        const key = unit.label.trim().toLowerCase()
        if (key && seen.has(key)) {
          ctx.addIssue({
            code: 'custom',
            path: ['units', i, 'label'],
            message: 'Label already used',
          })
        }
        seen.add(key)
      })
    })

export type ProductFormValues = z.infer<ReturnType<typeof getProductSchema>>
export type UnitValues = z.infer<typeof unitSchema>

export const DEFAULT_UNIT: UnitValues = { label: '', qtyPerUnit: 1, isBase: true }