import { cn } from '@/shared/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      aria-hidden
      className={cn('shrink-0 text-foreground', className)}
    >
      <path
        d="M180 105.6C180 146.69 146.69 180 105.6 180C64.51 180 31.2 146.69 31.2 105.6C31.2 64.51 64.51 31.2 105.6 31.2C146.69 31.2 180 64.51 180 105.6Z"
        stroke="#1FB86A"
        strokeWidth="42"
      />
      <g fill="currentColor">
        <path d="M432 0H316.8C290.29 0 268.8 21.4903 268.8 48V163.2C268.8 189.71 290.29 211.2 316.8 211.2H432C458.51 211.2 480 189.71 480 163.2V48C480 21.4903 458.51 0 432 0Z" />
        <path d="M163.2 268.8H48C21.4903 268.8 0 290.29 0 316.8V432C0 458.51 21.4903 480 48 480H163.2C189.71 480 211.2 458.51 211.2 432V316.8C211.2 290.29 189.71 268.8 163.2 268.8Z" />
        <path d="M432 268.8H316.8C290.29 268.8 268.8 290.29 268.8 316.8V432C268.8 458.51 290.29 480 316.8 480H432C458.51 480 480 458.51 480 432V316.8C480 290.29 458.51 268.8 432 268.8Z" />
      </g>
    </svg>
  )
}

interface LogoProps {
  /** Hides the wordmark and badge (collapsed sidebar). */
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="size-8" />
      {!collapsed && (
        <>
          <span className="text-title font-semibold tracking-tight">Oja</span>
          <span className="rounded-chip bg-primary-soft px-2 py-0.5 text-caption font-medium text-primary">
            Admin
          </span>
        </>
      )}
    </div>
  )
}