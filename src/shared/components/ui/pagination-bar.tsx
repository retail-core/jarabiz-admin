import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface PaginationBarProps {
  /** 1-based. */
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, pageCount, total, pageSize, onPageChange }: PaginationBarProps) {
  if (pageCount <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <nav aria-label="Pagination" className="mt-section flex items-center justify-between gap-3">
      <p className="text-caption text-muted-foreground">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
          Prev
        </Button>
        <span className="hidden px-2 text-body text-muted-foreground sm:inline">
          Page {page} of {pageCount}
        </span>
        <Button variant="outline" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}