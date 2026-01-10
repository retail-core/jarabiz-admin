import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import CategoriesPage from "@/pages/products/CategoriesPage";
import LoginPage from "@/pages/LoginPage";
import { authStorage } from "@/lib/auth";
import BrandsPage from './pages/products/BrandsPage';
import ProductsPage from './pages/products/ProductsPage';


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