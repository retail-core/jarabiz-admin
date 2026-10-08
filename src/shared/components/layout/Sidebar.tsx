import { LogOut, Moon, PanelLeftClose, PanelLeftOpen, Settings, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/shared/auth/auth-context'
import { getSidebarGroups } from '@/shared/config/navigation'
import { SETTINGS_ROUTE } from '@/shared/config/routes'
import { cn } from '@/shared/lib/utils'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useSidebarCollapsed } from './use-sidebar-collapsed'

const itemClass = (collapsed: boolean, active = false) =>
  cn(
    'flex h-control-sm w-full items-center gap-3 rounded-button text-body font-medium transition-colors',
    collapsed ? 'justify-center' : 'px-3',
    active
      ? 'bg-primary-soft text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  )

export function Sidebar() {
  const { user, logout } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const { collapsed, toggle } = useSidebarCollapsed()

  if (!user) return null

  const groups = getSidebarGroups(user.role)

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
      )}
    >
      <div
        className={cn(
          'flex h-nav-top shrink-0 items-center',
          collapsed ? 'justify-center' : 'px-4',
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-2">
        {groups.map((group, index) => (
          <div key={group.label} className={cn(index > 0 && 'mt-section')}>
            {collapsed ? (
              index > 0 && <div className="mx-3 mb-2 border-t" />
            ) : (
              <p className="mb-1 px-3 text-caption font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map(({ id, label, href, icon: Icon }) => (
                <li key={id}>
                  <NavLink
                    to={href}
                    end
                    title={collapsed ? label : undefined}
                    aria-label={collapsed ? label : undefined}
                    className={({ isActive }) => itemClass(collapsed, isActive)}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 flex-col gap-1 border-t p-3">
        <NavLink
          to={SETTINGS_ROUTE}
          title={collapsed ? 'Settings' : undefined}
          aria-label={collapsed ? 'Settings' : undefined}
          className={({ isActive }) => itemClass(collapsed, isActive)}
        >
          <Settings className="size-5 shrink-0" />
          {!collapsed && 'Settings'}
        </NavLink>

        {collapsed ? (
          <button
            type="button"
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={itemClass(true)}
          >
            <Sun className="size-5 dark:hidden" />
            <Moon className="hidden size-5 dark:block" />
          </button>
        ) : (
          <ThemeToggle className="my-1" />
        )}

        <div className={cn('flex items-center gap-2', collapsed ? 'flex-col' : 'px-1 pt-1')}>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-medium">{user.username}</p>
              <p className="truncate text-caption text-muted-foreground">{user.email}</p>
            </div>
          )}
          <button
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={logout}
            className="grid size-control-sm shrink-0 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
          >
            <LogOut className="size-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(itemClass(collapsed), 'mt-1')}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="size-5 shrink-0" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  )
}