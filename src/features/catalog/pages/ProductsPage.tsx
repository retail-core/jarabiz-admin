import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageSearch, Plus, Search, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { PaginationBar } from '@/shared/components/ui/pagination-bar'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import { ProductCard } from '../components/ProductCard'
import { ProductTable } from '../components/ProductTable'
import { useProducts } from '../hooks/useProducts'

const PAGE_SIZE = 20

function ListSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-stack">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 rounded-card border bg-card p-3">
          <div className="size-16 rounded-button bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-chip bg-muted" />
            <div className="h-3 w-1/3 rounded-chip bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div className="grid min-h-[40dvh] place-items-center text-center">
      <div className="flex flex-col items-center gap-3">
        <PackageSearch className="size-10 text-muted-foreground" />
        <div>
          <h2 className="text-title font-semibold">
            {search ? 'No matching products' : 'No products yet'}
          </h2>
          <p className="text-body text-muted-foreground">
            {search ? `Nothing found for “${search}”.` : 'Add your first product to get started.'}
          </p>
        </div>
        {search ? (
          <Button variant="outline" onClick={onClear}>
            Clear search
          </Button>
        ) : (
          <Button asChild>
            <Link to="/products/new">
              <Plus />
              Add product
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)

  // Input is local state (no cursor jumps); the URL mirrors it so Back from an edit keeps your place.
  const [input, setInput] = useState(params.get('q') ?? '')
  const search = useDebouncedValue(input.trim(), 300)

  const { data, isPending, isError, refetch } = useProducts({
    search,
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  })

  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const update = (changes: { q?: string; page?: number }) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (changes.q !== undefined) {
          changes.q ? next.set('q', changes.q) : next.delete('q')
          next.delete('page')
        }
        if (changes.page !== undefined) {
          changes.page > 1 ? next.set('page', String(changes.page)) : next.delete('page')
        }
        return next
      },
      { replace: true },
    )

  // If the page is past the end (e.g. the list shrank), jump to the last one.
  useEffect(() => {
    if (data && page > pageCount) {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          pageCount > 1 ? next.set('page', String(pageCount)) : next.delete('page')
          return next
        },
        { replace: true },
      )
    }
  }, [data, page, pageCount, setParams])

  const onSearch = (value: string) => {
    setInput(value)
    update({ q: value.trim() })
  }

  const goToPage = (next: number) => {
    update({ page: next })
    window.scrollTo({ top: 0 })
  }

  return (
    <div>
      <div className="mb-stack flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading font-semibold">Products</h1>
          {data && (
            <p className="text-body text-muted-foreground">
              {search ? `${total} result${total === 1 ? '' : 's'}` : `${total} total`}
            </p>
          )}
        </div>
        <Button asChild className="hidden md:inline-flex">
          <Link to="/products/new">
            <Plus />
            Add product
          </Link>
        </Button>
      </div>

      <div className="sticky top-nav-top z-20 -mx-page bg-background px-page py-2 md:top-0 md:mx-0 md:px-0">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={input}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search name, barcode, brand or category"
            aria-label="Search products"
            autoComplete="off"
            className="pr-12 pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {input && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearch('')}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-stack">
        {isPending ? (
          <ListSkeleton />
        ) : isError ? (
          <div className="grid min-h-[40dvh] place-items-center text-center">
            <div className="flex flex-col items-center gap-3">
              <p className="text-body text-muted-foreground">Couldn’t load products.</p>
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState search={search} onClear={() => onSearch('')} />
        ) : (
          <>
            <ul className="flex flex-col gap-stack md:hidden">
              {data.items.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <ProductTable products={data.items} />
            </div>
            <PaginationBar
              page={page}
              pageCount={pageCount}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  )
}