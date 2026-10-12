import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { MAX_UNITS, type ProductFormValues } from '../schema'
import { Switch } from '@/shared/components/ui/switch'
import { isOjaBarcode } from '../barcode'

/**
 * UI-only for now: units are validated but not sent to the backend
 * (see toFormData in hooks/useProducts.ts).
 */
export function UnitsField() {
  const {
    control,
    register,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'units' })
  const units = useWatch({ control, name: 'units' }) ?? []
  const hasBarcode = useWatch({ control, name: 'hasBarcode' })

  const baseLabel = units.find((u) => u.isBase)?.label?.trim()
  const rootError = errors.units?.root?.message ?? errors.units?.message

  const selectBase = (index: number) => {
    const opts = { shouldDirty: true, shouldValidate: isSubmitted }
    units.forEach((_, i) => setValue(`units.${i}.isBase`, i === index, opts))
    setValue(`units.${index}.qtyPerUnit`, 1, opts)
  }

  return (
    <section aria-labelledby="units-heading" className="flex flex-col gap-stack">
      <div className="flex items-end justify-between gap-3">
        <span className="shrink-0 text-caption text-muted-foreground">
          {fields.length}/{MAX_UNITS}
        </span>
      </div>

      <ul className="flex flex-col gap-stack">
        {fields.map((field, i) => {
          const unit = units[i]
          const isBase = !!unit?.isBase
          const rowErrors = errors.units?.[i]
          const removable = !isBase && fields.length > 1
          const showHint =
            !isBase && !!unit?.label?.trim() && !!baseLabel && unit.qtyPerUnit >= 2

          return (
            <li key={field.id} className="rounded-card border bg-card p-3 shadow-card">
              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isBase}
                  onClick={() => selectBase(i)}
                  className={cn(
                    'flex h-[1.7rem] items-center gap-2 rounded-chip border px-3 text-caption text-muted-foreground font-medium transition-colors [background-size:15%_15%]',
                    isBase
                      ? 'border-transparent bg-primary-soft text-primary'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >


                  <span
                    aria-hidden
                    className={cn(
                      'grid size-4 place-items-center rounded-chip border',
                      isBase ? 'border-primary' : 'border-muted-foreground',
                    )}
                  >
                    {isBase && <span className="size-2 rounded-chip bg-primary" />}
                  </span>
                  Base unit
                </button>

                {removable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove unit ${i + 1}`}
                    onClick={() => remove(i)}
                    className="text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`unit-${i}-label`} className="text-caption text-muted-foreground font-medium">
                    Label
                  </label>
                  <Input
                    id={`unit-${i}-label`}
                    placeholder={isBase ? 'e.g. Piece' : 'e.g. Carton'}
                    autoComplete="off"
                    aria-invalid={!!rowErrors?.label}
                    {...register(`units.${i}.label`)}
                  />
                  {rowErrors?.label && (
                    <p className="text-caption text-destructive">{rowErrors.label.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`unit-${i}-qty`} className="text-caption text-muted-foreground font-medium">
                    Qty per unit
                  </label>
                  <Input
                    id={`unit-${i}-qty`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    readOnly={isBase}
                    aria-readonly={isBase}
                    aria-invalid={!!rowErrors?.qtyPerUnit}
                    className={cn(isBase && 'bg-muted text-muted-foreground')}
                    {...register(`units.${i}.qtyPerUnit`, { valueAsNumber: true })}
                  />
                  {rowErrors?.qtyPerUnit && (
                    <p className="text-caption text-destructive">
                      {rowErrors.qtyPerUnit.message}
                    </p>
                  )}
                </div>
              </div>


              <div className="mt-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor={`unit-${i}-barcode`} className="text-caption text-muted-foreground font-medium">
                    Barcode
                    {!isBase && <span className="font-normal text-muted-foreground"> (optional)</span>}
                  </label>
                  {isBase && (
                    <label className="flex items-center gap-2 text-caption text-muted-foreground">
                      Has barcode
                      <Switch
                        checked={hasBarcode}
                        onCheckedChange={(on) => {
                          setValue('hasBarcode', on, { shouldDirty: true })
                          if (on && isOjaBarcode(unit?.barcode ?? '')) {
                            setValue(`units.${i}.barcode`, '', { shouldDirty: true })
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {isBase && !hasBarcode ? (
                  <p className="rounded-input bg-muted px-3.5 py-2.5 text-caption text-muted-foreground">
                    {isOjaBarcode(unit?.barcode ?? '')
                      ? `Oja code ${unit?.barcode}`
                      : 'An Oja barcode is generated when you save. Use this only if this item has no barcode.'}
                  </p>
                ) : (
                  <Input
                    id={`unit-${i}-barcode`}
                    placeholder="Scan or type the barcode"
                    autoComplete="off"
                    autoCapitalize="none"
                    aria-invalid={!!rowErrors?.barcode}
                    {...register(`units.${i}.barcode`)}
                  />
                )}
                {rowErrors?.barcode && (
                  <p className="text-caption text-destructive">{rowErrors.barcode.message}</p>
                )}
              </div>

              {showHint && (
                <p className="mt-2 text-caption text-muted-foreground">
                  1 {unit.label.trim()} = {unit.qtyPerUnit} {baseLabel}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {rootError && (
        <p role="alert" className="text-caption text-destructive">
          {rootError}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={fields.length >= MAX_UNITS}
        onClick={() => append({ label: '', qtyPerUnit: 2, isBase: false, barcode: '' })}
      >
        <Plus />
        Add unit
      </Button>
    </section>
  )
}