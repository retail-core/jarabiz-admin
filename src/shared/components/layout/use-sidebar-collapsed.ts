import { useCallback, useState } from 'react'

const KEY = 'jarabiz_sidebar_collapsed'

const read = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(read)

  const toggle = useCallback(() => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(KEY, next ? '1' : '0')
    } catch {
      /* storage unavailable: state still works for this session */
    }
  }, [collapsed])

  return { collapsed, toggle }
}