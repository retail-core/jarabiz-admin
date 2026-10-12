import { z } from "zod";
import { isValidEan13, OJA_PREFIX } from "./barcode";

export const MAX_UNITS = 4;

export const unitSchema = z.object({
  unitId: z.string().optional(),
  label: z.string().trim().min(1, "Enter a label"),
  qtyPerUnit: z
    .number({ error: "Enter a quantity" })
    .int("Whole numbers only")
    .min(1, "Minimum is 1"),
  isBase: z.boolean(),
  barcode: z.string().trim(),
});

/** requireImage: true on create, false on edit (existing image is kept). */
export const getProductSchema = (requireImage: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, "Enter the product name"),
      hasBarcode: z.boolean(),
      categoryId: z.string().min(1, "Select a category"),
      nafdacRegNo: z.string().trim().optional(),
      manufacturer: z.string().trim().optional(),
      image: z.instanceof(File).nullable(),
      units: z
        .array(unitSchema)
        .min(1, "Add at least one unit")
        .max(MAX_UNITS, `Maximum ${MAX_UNITS} units`),
    })
    .superRefine((data, ctx) => {
      if (requireImage && !data.image) {
        ctx.addIssue({
          code: "custom",
          path: ["image"],
          message: "Add a product image",
        });
      }

      const baseCount = data.units.filter((u) => u.isBase).length;
      if (baseCount !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["units"],
          message: "Select exactly one base unit",
        });
      }

      const seen = new Set<string>();
      const seenBarcodes = new Set<string>();

      data.units.forEach((unit, i) => {
        if (unit.isBase && unit.qtyPerUnit !== 1) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "qtyPerUnit"],
            message: "Base unit must be 1",
          });
        }
        if (!unit.isBase && unit.qtyPerUnit < 2) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "qtyPerUnit"],
            message: "Must be more than 1",
          });
        }
        const key = unit.label.trim().toLowerCase();
        if (key && seen.has(key)) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "label"],
            message: "Label already used",
          });
        }

        const code = unit.barcode.trim().toLowerCase();
        if (unit.isBase && data.hasBarcode && !code) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "barcode"],
            message: "Base unit barcode is required",
          });
        }
        if (code && seenBarcodes.has(code)) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "barcode"],
            message: "Barcode already used",
          });
        }

        if (
          code.startsWith(OJA_PREFIX) &&
          (!isValidEan13(code) || (unit.isBase && data.hasBarcode))
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["units", i, "barcode"],
            message:
              "Barcodes starting with 04 are reserved. If the pack has none, switch off “Has barcode”.",
          });
        }
        if (code) seenBarcodes.add(code);

        seen.add(key);
      });
    });

export type ProductFormValues = z.infer<ReturnType<typeof getProductSchema>>;
export type UnitValues = z.infer<typeof unitSchema>;

export const DEFAULT_UNIT: UnitValues = {
  label: "",
  qtyPerUnit: 1,
  isBase: true,
  barcode: "",
};

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Enter a category name"),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
