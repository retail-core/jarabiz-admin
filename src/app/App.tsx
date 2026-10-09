import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicOnlyRoute, ProtectedRoute } from '@/shared/auth/guards'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { PageFallback } from '@/shared/components/layout/PageFallback'
import { Placeholder } from '@/shared/components/layout/Placeholder'
import { DEFAULT_ROUTE, LOGIN_ROUTE, SETTINGS_ROUTE } from '@/shared/config/routes'

const LoginPage = lazy(() => import('@/shared/auth/LoginPage'))
const ProductsPage = lazy(() => import('@/features/catalog/pages/ProductsPage'))
const CategoriesPage = lazy(() => import('@/features/catalog/pages/CategoriesPage'))
const BrandsPage = lazy(() => import('@/features/catalog/pages/BrandsPage'))
const ProductFormPage = lazy(() => import('@/features/catalog/pages/ProductFormPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Catalog: business_owner + staff */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/categories" element={<CategoriesPage />} />
              <Route path="/products/brands" element={<BrandsPage />} />
              <Route path="/products/new" element={<ProductFormPage mode="create" />} />
              <Route path="/products/:id/edit" element={<ProductFormPage mode="edit" />} />

              <Route path={SETTINGS_ROUTE} element={<Placeholder title="Settings" />} />

              {/* Future owner-only modules go here:
                  <Route element={<RoleGuard roles={['business_owner']} />}>
                    <Route path="/customers" element={<CustomersPage />} />
                  </Route> */}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
          <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}