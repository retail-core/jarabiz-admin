import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { MAX_UNITS, type ProductFormValues } from '../schema'

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
        <div>
          <h2 id="units-heading" className="text-title font-semibold">
            Units
          </h2>
          <p className="text-body text-muted-foreground">
            How this product is sold. Mark one unit as the base (quantity 1).
          </p>
        </div>
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
                    'flex h-control-sm items-center gap-2 rounded-chip border px-3 text-body font-medium transition-colors',
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
                  <label htmlFor={`unit-${i}-label`} className="text-body font-medium">
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
                  <label htmlFor={`unit-${i}-qty`} className="text-body font-medium">
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
        onClick={() => append({ label: '', qtyPerUnit: 2, isBase: false })}
      >
        <Plus />
        Add unit
      </Button>
    </section>
  )
}