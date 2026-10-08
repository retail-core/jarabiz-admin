import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const SAFE_TOP = 'calc(env(safe-area-inset-top) + var(--spacing-stack))'

const Toaster = (props: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      offset={{ top: SAFE_TOP }}
      mobileOffset={{ top: SAFE_TOP }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-primary" />,
        info: <InfoIcon className="size-5 text-status-pending" />,
        warning: <TriangleAlertIcon className="size-5 text-status-warning" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{ classNames: { toast: 'shadow-pop' } }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--line)',
          '--border-radius': 'var(--radius-input)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }