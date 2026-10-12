import { useEffect, useState, type ReactNode } from 'react'
import { isAxiosError } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/shared/auth/AuthProvider'
import { Toaster } from '@/shared/components/ui/sonner'
import { AUTH_LOGOUT_EVENT } from '@/shared/lib/auth'
import { UpdatePrompt } from '@/shared/components/layout/UpdatePrompt'
import { useKeyboardInset } from '@/shared/lib/use-keyboard-inset'
import { IconContext } from '@phosphor-icons/react'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Never retry client errors (400-499); retry network/5xx once.
        retry: (failureCount, error) => {
          if (isAxiosError(error) && error.response && error.response.status < 500) return false
          return failureCount < 1
        },
      },
    },
  })

export function Providers({ children }: { children: ReactNode }) {
  useKeyboardInset()
  const [queryClient] = useState(createQueryClient)

  // Drop cached data on logout so the next user never sees the previous one's.
  useEffect(() => {
    const clear = () => queryClient.clear()
    window.addEventListener(AUTH_LOGOUT_EVENT, clear)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, clear)
  }, [queryClient])

  return (
    <IconContext value={{ weight: 'regular' }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <UpdatePrompt />
            <Toaster position="top-center" />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </IconContext>
  )
}