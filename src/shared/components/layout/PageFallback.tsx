import { Loader2 } from 'lucide-react'

/** Shown while a lazy route chunk loads. */
export function PageFallback() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-[50dvh] place-items-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}