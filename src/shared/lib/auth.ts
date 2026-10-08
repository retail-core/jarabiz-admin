export const ROLES = ['business_owner', 'staff'] as const
export type Role = (typeof ROLES)[number]

export interface User {
  id: string
  username: string
  email: string
  role: Role
}

const TOKEN_KEY = 'jarabiz_token'
const USER_KEY = 'jarabiz_user'

export const AUTH_LOGOUT_EVENT = 'auth:logout'

const isRole = (value: unknown): value is Role =>
  typeof value === 'string' && (ROLES as readonly string[]).includes(value)

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setSession: (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser: (): User | null => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (!raw) return null
      const user = JSON.parse(raw) as User
      return isRole(user?.role) ? user : null
    } catch {
      return null
    }
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  /** Clears the session and notifies AuthProvider. No page reload. */
  logout: () => {
    authStorage.clear()
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
  },
}