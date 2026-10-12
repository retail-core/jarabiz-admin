import { useMemo, useState } from 'react'
import { ChevronRight, Layers, Plus, Search, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { Input } from '@/shared/components/ui/input'
import { CategoryFormDialog } from '../components/CategoryFormDialog'
import { useCategories, type Category } from '../hooks/useCategories'

const SEARCH_THRESHOLD = 6

function ListSkeleton() {
  return (
    <div aria-hidden className="divide-y overflow-hidden rounded-card border bg-card">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 p-4">
          <div className="size-10 rounded-button bg-muted" />
          <div className="h-4 w-1/3 rounded-chip bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function CategoriesPage() {
  const { data, isError, refetch, createMutation, updateMutation, deleteMutation } =
    useCategories()

  const [search, setSearch] = useState('')
  const [form, setForm] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const categories = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (data ?? [])
      .filter((c) => c.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, search])

  const openCreate = () => setForm({ open: true, category: null })
  const openEdit = (category: Category) => setForm({ open: true, category })

  const save = (name: string) =>
    form.category
      ? updateMutation.mutateAsync({ id: form.category.id, name })
      : createMutation.mutateAsync({ name })

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteOpen(false) })
  }

  return (
    <div className="md:max-w-2xl">
      <div className="mb-stack flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading font-semibold">Categories</h1>
          {data && <p className="text-body text-muted-foreground">{data.length} total</p>}
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Add category
        </Button>
      </div>

      {data && data.length > SEARCH_THRESHOLD && (
        <div className="relative mb-stack">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            aria-label="Search categories"
            autoComplete="off"
            className="pr-12 pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {isError ? (
        <div className="grid min-h-[40dvh] place-items-center text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-body text-muted-foreground">Couldn’t load categories.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </div>
      ) : !data ? (
        <ListSkeleton />
      ) : categories.length === 0 ? (
        <div className="grid min-h-[40dvh] place-items-center text-center">
          <div className="flex flex-col items-center gap-3">
            <Layers className="size-10 text-muted-foreground" />
            <div>
              <h2 className="text-title font-semibold">
                {search ? 'No matching categories' : 'No categories yet'}
              </h2>
              <p className="text-body text-muted-foreground">
                {search
                  ? `Nothing found for “${search}”.`
                  : 'Create a category to organize your products.'}
              </p>
            </div>
            {search ? (
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear search
              </Button>
            ) : (
              <Button onClick={openCreate}>
                <Plus />
                Add category
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ul className="divide-y overflow-hidden rounded-card border bg-card shadow-card">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => openEdit(c)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted active:bg-muted"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-button bg-primary-soft text-primary">
                  <Layers className="size-5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-body font-medium">{c.name}</span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <CategoryFormDialog
        open={form.open}
        onOpenChange={(open) => setForm((f) => ({ ...f, open }))}
        category={form.category}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onSubmit={save}
        onDelete={(category) => {
          setForm((f) => ({ ...f, open: false }))
          setDeleteTarget(category)
          setDeleteOpen(true)
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete “${deleteTarget?.name ?? ''}”?`}
        description="Products in this category may be affected. This can’t be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}