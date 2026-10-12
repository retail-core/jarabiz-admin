import { useMemo, type ReactNode } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { SearchableSelect } from '@/shared/components/ui/searchable-select'
import { useCategories } from '../hooks/useCategories'
import { getProductSchema, type ProductFormValues } from '../schema'
import { ImageField } from './ImageField'
import { UnitsField } from './UnitsField'

interface ProductFormProps {
  mode: 'create' | 'edit'
  defaultValues: ProductFormValues
  existingImageUrl?: string | null
  isSaving: boolean
  onSubmit: (values: ProductFormValues) => Promise<unknown>
  onCancel: () => void
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-muted-foreground font-medium text-caption">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </label>
      {children}
      {error && <p className="text-caption text-destructive">{error}</p>}
    </div>
  )
}

export function ProductForm({
  mode,
  defaultValues,
  existingImageUrl,
  isSaving,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const isEdit = mode === 'edit'
  const schema = useMemo(() => getProductSchema(!isEdit), [isEdit])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = form

  const { data: categories } = useCategories()
//   const { data: brands } = useBrands()

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch {
      // The mutation hook already shows the backend message as a toast.
      // Map specific errors to fields here (e.g. duplicate barcode -> setError('barcode', ...)).
    }
  })

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submit} className="mx-auto flex max-w-2xl flex-col gap-section">
        <section className="flex flex-col gap-4 rounded-card border bg-card p-page shadow-card">
          <Field label="Name" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="e.g. Coca-Cola Original 50cl"
              autoComplete="off"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </Field>

            <Field label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <SearchableSelect
                    options={categories}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category"
                    searchPlaceholder="Search categories…"
                    aria-invalid={!!errors.categoryId}
                  />
                )}
              />
            </Field>

            {/* <Field label="Brand" htmlFor="brandId" error={errors.brandId?.message}>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <SearchableSelect
                    options={brands}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select brand"
                    searchPlaceholder="Search brands…"
                    aria-invalid={!!errors.brandId}
                  />
                )}
              />
            </Field> */}

          {/* <div className="grid gap-4 md:grid-cols-2">
            <Field label="NAFDAC number" htmlFor="nafdacRegNo" optional>
              <Input id="nafdacRegNo" autoComplete="off" {...register('nafdacRegNo')} />
            </Field>
            <Field label="Manufacturer" htmlFor="manufacturer" optional>
              <Input id="manufacturer" autoComplete="off" {...register('manufacturer')} />
            </Field>
          </div> */}
        </section>

        <ImageField existingUrl={existingImageUrl} />

        <UnitsField />

        {/* Fixed on mobile (space reserved by AppLayout), sticky card on desktop. */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-card px-page pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-nav md:sticky md:inset-x-auto md:rounded-card md:border md:p-3 md:shadow-card md:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSaving}
            className="hidden md:inline-flex"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving || (isEdit && !isDirty)}
            className="w-full md:w-auto md:min-w-40"
          >
            {isSaving && <Loader2 className="animate-spin" />}
            {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Save product'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}