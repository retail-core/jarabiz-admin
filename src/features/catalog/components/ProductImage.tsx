import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export function ProductImage({ src, className }: { src?: string | null; className?: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-button border bg-card',
        className,
      )}
    >
      {failed || !src ? (
        <ImageOff className="size-5 text-muted-foreground" />
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-contain p-1"
        />
      )}
    </div>
  )
}