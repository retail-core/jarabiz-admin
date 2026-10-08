import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { isFullscreenRoute } from '@/shared/config/navigation'
import { cn } from '@/shared/lib/utils'
import { BottomNav } from './BottomNav'
import { Logo } from './Logo'
import { PageFallback } from './PageFallback'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const { pathname } = useLocation()
  const fullscreen = isFullscreenRoute(pathname)

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {!fullscreen && (
          <header className="sticky top-0 z-30 border-b bg-background pt-safe md:hidden">
            <div className="flex h-nav-top items-center px-page">
              <Logo />
            </div>
          </header>
        )}

        <main
          className={cn(
            'flex-1 px-page py-section md:px-page-lg',
            // Reserve space for the fixed bar at the bottom (mobile only).
            fullscreen
              ? 'pb-[calc(var(--spacing-savebar)+env(safe-area-inset-bottom))] pt-safe'
              : 'pb-[calc(var(--spacing-nav-bottom)+env(safe-area-inset-bottom)+var(--spacing-section))]',
            'md:pb-section md:pt-section',
          )}
        >
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}