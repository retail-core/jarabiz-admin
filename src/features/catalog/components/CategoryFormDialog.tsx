import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { Category } from '../hooks/useCategories'
import { categorySchema, type CategoryFormValues } from '../schema'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = create. */
  category: Category | null
  isSaving: boolean
  onSubmit: (name: string) => Promise<unknown>
  onDelete: (category: Category) => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  isSaving,
  onSubmit,
  onDelete,
}: CategoryFormDialogProps) {
  const isEdit = !!category
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) reset({ name: category?.name ?? '' })
  }, [open, category, reset])

  const submit = handleSubmit(async ({ name }) => {
    try {
      await onSubmit(name)
      onOpenChange(false)
    } catch {
      // The mutation hook already shows the backend message as a toast.
    }
  })

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>
        </DialogHeader>

        <form noValidate onSubmit={submit} className="grid gap-stack">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-name" className="text-body font-medium">
              Name
            </label>
            <Input
              id="category-name"
              placeholder="e.g. Beverages"
              autoComplete="off"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && <p className="text-caption text-destructive">{errors.name.message}</p>}
          </div>

          {/* Source order is bottom-to-top on mobile (flex-col-reverse): Save ends up on top. */}
          <DialogFooter>
            {category && (
              <Button
                type="button"
                variant="ghost"
                disabled={isSaving}
                onClick={() => onDelete(category)}
                className="text-destructive hover:bg-destructive-soft md:mr-auto"
              >
                <Trash2 />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || (isEdit && !isDirty)}>
              {isSaving && <Loader2 className="animate-spin" />}
              {isEdit ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}