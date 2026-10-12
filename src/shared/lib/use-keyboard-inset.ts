import { useEffect } from 'react'

/** Publishes the on-screen keyboard height as --keyboard-inset so bottom sheets can sit above it. */
export function useKeyboardInset() {
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      document.documentElement.style.setProperty('--keyboard-inset', `${Math.round(inset)}px`)
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      document.documentElement.style.removeProperty('--keyboard-inset')
    }
  }, [])
}