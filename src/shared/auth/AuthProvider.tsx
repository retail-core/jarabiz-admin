import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AUTH_LOGOUT_EVENT, authStorage, type Role, type User } from '@/shared/lib/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

const readSession = (): User | null =>
    authStorage.getToken() ? authStorage.getUser() : null

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(readSession)

    // Syncs on 401 logout (same tab) and login/logout in other tabs.
    useEffect(() => {
        const sync = () => setUser(readSession())
        window.addEventListener(AUTH_LOGOUT_EVENT, sync)
        window.addEventListener('storage', sync)
        return () => {
            window.removeEventListener(AUTH_LOGOUT_EVENT, sync)
            window.removeEventListener('storage', sync)
        }
    }, [])

    const login = useCallback((token: string, nextUser: User) => {
        authStorage.setSession(token, nextUser)
        setUser(nextUser)
    }, [])

    const logout = useCallback(() => authStorage.logout(), [])

    const hasRole = useCallback(
        (roles?: readonly Role[]) => !roles || (!!user && roles.includes(user.role)),
        [user],
    )

    const value = useMemo<AuthContextValue>(
        () => ({ user, isAuthenticated: !!user, hasRole, login, logout }),
        [user, hasRole, login, logout],
    )

    return <AuthContext value={value}>{children}</AuthContext>
}