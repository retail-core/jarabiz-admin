import { cn } from '@/shared/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
  className?: string
}

export function Switch({ checked, onCheckedChange, id, className }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-chip outline-none transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 focus-visible:ring-2 focus-visible:ring-ring/40',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
        className,
      )}
    >
      <span
        className={cn(
          'size-5 rounded-chip bg-card shadow-card transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}