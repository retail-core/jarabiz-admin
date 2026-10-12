import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import { ProductImage } from './ProductImage'

const th = 'px-4 py-3 text-left text-caption font-medium uppercase tracking-wide text-muted-foreground'

export function ProductTable({ products }: { products: Product[] }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-card border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-body">
          <thead className="border-b bg-muted/50">
            <tr>
              <th scope="col" className={th}>Product</th>
              <th scope="col" className={th}>Category</th>
              <th scope="col" className={th}>Barcode</th>
              <th scope="col" className={th}>Units</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/products/${p.id}/edit`)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage src={p.image_url} className="size-12" />
                    <Link
                      to={`/products/${p.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="line-clamp-2 max-w-xs font-medium outline-none hover:text-primary focus-visible:underline"
                    >
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className='px-4 py-3 text-muted-foreground'>
                    {p.category[0].name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.units.find((u) => u.is_base)?.barcode ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.units.map((u) => (u.is_base ? u.label : `${u.label} ×${u.qty_per_unit}`)).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}