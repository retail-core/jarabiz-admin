import * as Dialog from '@radix-ui/react-dialog'
import { LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SETTINGS_ROUTE } from '@/shared/config/routes'
import { useAuth } from '@/shared/auth/auth-context'
import type { Role } from '@/shared/lib/auth'
import { ThemeToggle } from './ThemeToggle'

const ROLE_LABEL: Record<Role, string> = {
  business_owner: 'Business owner',
  staff: 'Staff',
}

const rowClass =
  'flex h-control w-full items-center gap-3 rounded-button px-3 text-body font-medium transition-colors hover:bg-muted'

interface MoreSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const { user, logout } = useAuth()
  const close = () => onOpenChange(false)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-card border-t bg-card px-page pt-3 pb-[max(var(--spacing-page),env(safe-area-inset-bottom))] shadow-pop data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom"
        >
          <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-chip bg-border" />

          <Dialog.Title className="sr-only">More</Dialog.Title>

          {user && (
            <div className="mb-3 px-3">
              <p className="truncate text-title font-semibold">{user.username}</p>
              <p className="truncate text-caption text-muted-foreground">
                {user.email} · {ROLE_LABEL[user.role]}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Link to={SETTINGS_ROUTE} onClick={close} className={rowClass}>
              <Settings className="size-5 text-muted-foreground" />
              Settings
            </Link>

            <div className="px-3 py-2">
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => {
                close()
                logout()
              }}
              className={`${rowClass} text-destructive hover:bg-destructive-soft`}
            >
              <LogOut className="size-5" />
              Log out
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}