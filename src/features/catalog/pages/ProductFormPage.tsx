import { PackageX } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { PageFallback } from '@/shared/components/layout/PageFallback'
import { ProductForm } from '../components/ProductForm'
import { getDefaultValues } from '../defaults'
import { useCreateProduct, useProduct, useUpdateProduct } from '../hooks/useProducts'
import { CaretLeftIcon } from '@phosphor-icons/react'

const LIST_ROUTE = '/products'

function FormHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="mx-auto mb-section flex max-w-2xl items-center gap-2 mt-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Back to products"
        onClick={onBack}
        className="-ml-3"
      >
        <CaretLeftIcon />
      </Button>
      <h1 className="truncate text-xl font-semibold">{title}</h1>
    </header>
  )
}

function CreateProduct() {
  const navigate = useNavigate()
  const create = useCreateProduct()
  const back = () => navigate(LIST_ROUTE)

  return (
    <>
      <FormHeader title="Add product" onBack={back} />
      <ProductForm
        mode="create"
        defaultValues={getDefaultValues()}
        isSaving={create.isPending}
        onCancel={back}
        onSubmit={async (values) => {
          await create.mutateAsync(values)
          navigate(LIST_ROUTE)
        }}
      />
    </>
  )
}

function EditProduct({ id }: { id: string }) {
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id)
  const update = useUpdateProduct(id)
  const back = () => navigate(LIST_ROUTE)

  if (isLoading) return <PageFallback />

  if (!product) {
    return (
      <div className="grid min-h-[50dvh] place-items-center text-center">
        <div className="flex flex-col items-center gap-3">
          <PackageX className="size-10 text-muted-foreground" />
          <div>
            <h1 className="text-title font-semibold">Product not found</h1>
            <p className="text-body text-muted-foreground">
              It may have been removed or the link is wrong.
            </p>
          </div>
          <Button variant="outline" onClick={back}>
            Back to products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <FormHeader title="Edit product" onBack={back} />
      <ProductForm
        key={product.id}
        mode="edit"
        defaultValues={getDefaultValues(product)}
        existingImageUrl={product.image_url}
        isSaving={update.isPending}
        onCancel={back}
        onSubmit={async (values) => {
          await update.mutateAsync(values)
          navigate(LIST_ROUTE)
        }}
      />
    </>
  )
}

export default function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  return mode === 'edit' && id ? <EditProduct id={id} /> : <CreateProduct />
}