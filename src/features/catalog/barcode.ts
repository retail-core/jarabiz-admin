import type { ProductFormValues } from './schema'

export const OJA_PREFIX = "04";

const checkDigit = (first12: string) =>
  (10 -
    ([...first12].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0) %
      10)) %
  10;

export const isValidEan13 = (code: string) =>
  /^\d{13}$/.test(code) && checkDigit(code.slice(0, 12)) === Number(code[12]);

export const isOjaBarcode = (code: string) =>
  code.startsWith(OJA_PREFIX) && isValidEan13(code);

const normalize = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** Same name + category + unit always gives the same code. */
export async function deriveOjaBarcode(
  name: string,
  categoryId: string,
  unitLabel: string,
) {
  const input = new TextEncoder().encode(
    `${normalize(name)}|${categoryId}|${normalize(unitLabel)}`,
  );
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", input));

  let n = 0n;
  for (const byte of hash.slice(0, 8)) n = (n << 8n) | BigInt(byte);

  const body = OJA_PREFIX + (n % 10_000_000_000n).toString().padStart(10, "0");
  return body + checkDigit(body);
}

/** Fills the base unit's barcode with an Oja code when "Has barcode" is off. Existing Oja codes are kept. */
export async function withOjaBarcode(values: ProductFormValues): Promise<ProductFormValues> {
  if (values.hasBarcode) return values
  const units = await Promise.all(
    values.units.map(async (u) =>
      !u.isBase || isOjaBarcode(u.barcode.trim())
        ? u
        : { ...u, barcode: await deriveOjaBarcode(values.name, values.categoryId, u.label) },
    ),
  )
  return { ...values, units }
}