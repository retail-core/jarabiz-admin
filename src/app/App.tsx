import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import CategoriesPage from "@/features/catalog/pages/CategoriesPage";
import LoginPage from "@/shared/auth/LoginPage";
import { authStorage } from "@/shared/lib/auth";
import BrandsPage from '@/features/catalog/pages/BrandsPage';
import ProductsPage from '@/features/catalog/pages/ProductsPage';


function App() {
  const token = authStorage.getToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/products"
          element={token ? <DashboardLayout><ProductsPage /></DashboardLayout> : <Navigate to="/login" />}
        />

        {/* Protected Routes */}
        <Route
          path="/products/categories"
          element={token ? <DashboardLayout><CategoriesPage /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/products/brands"
          element={token ? <DashboardLayout><BrandsPage /></DashboardLayout> : <Navigate to="/login" />}
        />


        {/* Default Redirect */}
        <Route path="*" element={<Navigate to={token ? "/products/categories" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;