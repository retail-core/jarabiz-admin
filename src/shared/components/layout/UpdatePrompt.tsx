import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'sonner'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for a new version hourly while the app stays open.
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    if (!needRefresh) return
    toast('A new version is available', {
      id: 'sw-update',
      duration: Infinity,
      action: { label: 'Update', onClick: () => updateServiceWorker(true) },
    })
  }, [needRefresh, updateServiceWorker])

  return null
}