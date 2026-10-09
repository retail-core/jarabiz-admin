import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCw, Undo2, X } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { compressToWebp } from '@/shared/lib/image'
import { cn } from '@/shared/lib/utils'
import type { ProductFormValues } from '../schema'

interface ImageFieldProps {
  /** Current image when editing. Kept unless the user picks a new one. */
  existingUrl?: string | null
}

export function ImageField({ existingUrl }: ImageFieldProps) {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProductFormValues>()
  const image = useWatch({ control, name: 'image' })

  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const setPreviewFor = (file: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = file ? URL.createObjectURL(file) : null
    setPreview(previewRef.current)
  }

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allows re-picking the same file
    if (!file) return

    setBusy(true)
    clearErrors('image')
    try {
      const webp = await compressToWebp(file)
      setPreviewFor(webp)
      setValue('image', webp, { shouldDirty: true, shouldValidate: true })
    } catch {
      setError('image', { type: 'manual', message: 'Could not read this image. Try a JPG or PNG.' })
    } finally {
      setBusy(false)
    }
  }

  const clearNewImage = () => {
    setPreviewFor(null)
    setValue('image', null, { shouldDirty: true })
  }

  const src = image ? preview : (existingUrl ?? null)
  const error = errors.image?.message
  const hint = image
    ? `WebP · ${Math.max(1, Math.round(image.size / 1024))} KB`
    : existingUrl
      ? 'Current image'
      : 'JPG or PNG. Compressed to WebP automatically.'

  return (
    <section aria-labelledby="image-heading" className="flex flex-col gap-stack">
      <h2 id="image-heading" className="text-title font-semibold">
        Product image
      </h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={src ? 'Change product image' : 'Add product image'}
          aria-invalid={!!error}
          className={cn(
            'relative grid size-32 shrink-0 place-items-center overflow-hidden rounded-card border border-dashed bg-muted outline-none transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/40',
            error && 'border-destructive',
          )}
        >
          {src ? (
            <img src={src} alt="" className="size-full object-contain p-2" />
          ) : (
            <ImagePlus className="size-8 text-muted-foreground" />
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-scrim">
              <Loader2 className="size-6 animate-spin text-white" />
            </span>
          )}
        </button>

        <div className="flex min-w-0 flex-col items-start gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {src ? <RefreshCw /> : <ImagePlus />}
            {src ? 'Change image' : 'Add image'}
          </Button>

          {image && (
            <Button type="button" variant="ghost" size="sm" onClick={clearNewImage}>
              {existingUrl ? <Undo2 /> : <X />}
              {existingUrl ? 'Keep current' : 'Remove'}
            </Button>
          )}

          <p className="text-caption text-muted-foreground">{hint}</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onPick}
      />
    </section>
  )
}