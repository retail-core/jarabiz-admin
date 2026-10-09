import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { ProductImage } from './ProductImage'

const chip = 'rounded-chip bg-muted px-2 py-0.5 text-caption text-muted-foreground'

export function ProductCard({ product }: { product: Product }) {
  const [firstCategory, ...otherCategories] = product.category

  return (
    <Link
      to={`/products/${product.id}/edit`}
      className="flex items-center gap-3 rounded-card border bg-card p-3 shadow-card outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 active:bg-muted"
    >
      <ProductImage src={product.image_url} className="size-16" />

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-body font-medium">{product.name}</p>
        <p className="mt-0.5 truncate text-caption text-muted-foreground">{product.barcode}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {firstCategory && (
            <span className={chip}>
              {firstCategory.name}
              {otherCategories.length > 0 && ` +${otherCategories.length}`}
            </span>
          )}
          <span className={chip}>{product.brand.name}</span>
        </div>
      </div>

      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  )
}