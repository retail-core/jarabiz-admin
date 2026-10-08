import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Logo } from '@/shared/components/layout/Logo'
import { api, getApiError, LOGIN_PATH } from '@/shared/lib/api'
import { ROLES, type User } from '@/shared/lib/auth'
import { useAuth } from './auth-context'

const schema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})
type Values = z.infer<typeof schema>

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

class NoAccessError extends Error {
  constructor() {
    super("This account doesn't have access to the admin app.")
  }
}

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const { data } = await api.post<LoginResponse>(LOGIN_PATH, values)
      if (!(ROLES as readonly string[]).includes(data.user.role)) throw new NoAccessError()
      return data
    },
    // PublicOnlyRoute redirects to the page the user came from once logged in.
    onSuccess: (data) => login(data.access_token, data.user),
  })

  const errorMessage = mutation.error
    ? mutation.error instanceof NoAccessError
      ? mutation.error.message
      : getApiError(mutation.error).message
    : null

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-page py-section pt-safe pb-safe">
      <div className="w-full max-w-sm">
        <Logo className="mb-section justify-center" />

        <div className="rounded-card border bg-card p-6 shadow-card">
          <h1 className="text-heading font-semibold">Sign in</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Use your admin account to continue.
          </p>

          <form
            noValidate
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-section flex flex-col gap-4"
          >
            {errorMessage && (
              <div
                role="alert"
                className="rounded-input bg-destructive-soft px-4 py-3 text-body text-destructive"
              >
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-body font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-caption text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-body font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className="pr-12"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-caption text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={mutation.isPending} className="mt-2 w-full">
              {mutation.isPending && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}