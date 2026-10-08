import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import type { Role } from '@/shared/lib/auth'
import { DEFAULT_ROUTE, LOGIN_ROUTE } from '@/shared/config/routes'
import { useAuth } from './auth-context'

/** Wraps routes that need a logged-in user. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />
  }
  return <Outlet />
}



/** Wraps routes limited to specific roles. Others are sent to the default route. */
export function RoleGuard({ roles }: { roles: readonly Role[] }) {
  const { hasRole } = useAuth()
  return hasRole(roles) ? <Outlet /> : <Navigate to={DEFAULT_ROUTE} replace />
}

/** Wraps /login so logged-in users skip it. */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from
    return <Navigate to={from ? from.pathname + from.search : DEFAULT_ROUTE} replace />
  }
  return <Outlet />
}