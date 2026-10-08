import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/auth/auth-context'
import { MORE_ITEM, getMobileTabs, isFullscreenRoute } from '@/shared/config/navigation'
import { cn } from '@/shared/lib/utils'
import { MoreSheet } from './MoreSheet'

const tabClass = 'flex h-full flex-col items-center justify-center gap-1 text-caption font-medium transition-colors'

export function BottomNav() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!user || isFullscreenRoute(pathname)) return null

  const tabs = getMobileTabs(user.role)
  const MoreIcon = MORE_ITEM.icon

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 bg-card pb-safe shadow-nav md:hidden"
      >
        <ul
          className="grid h-nav-bottom"
          style={{ gridTemplateColumns: `repeat(${tabs.length + 1}, minmax(0, 1fr))` }}
        >
          {tabs.map(({ id, label, href, icon: Icon, primary }) => (
            <li key={id}>
              <NavLink
                to={href}
                end
                aria-label={label}
                className={({ isActive }) =>
                  cn(
                    tabClass,
                    !primary && (isActive ? 'text-primary' : 'text-muted-foreground'),
                  )
                }
              >
                {primary ? (
                  <span className="-mt-5 grid size-14 place-items-center rounded-button bg-primary text-primary-foreground shadow-pop transition-colors active:bg-primary-hover">
                    <Icon className="size-6" />
                  </span>
                ) : (
                  <>
                    <Icon className="size-6" />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
              className={cn(
                tabClass,
                'w-full',
                moreOpen ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <MoreIcon className="size-6" />
              {MORE_ITEM.label}
            </button>
          </li>
        </ul>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  )
}