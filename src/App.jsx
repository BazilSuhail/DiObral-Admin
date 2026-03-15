import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGlobalStore } from "./store/globalStore";
import DashboardLayout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import OrderList from "./pages/orders/OrderList";
import OrderDetail from "./pages/orders/OrderDetail";
import CouponList from "./pages/coupons/CouponList";
import CouponForm from "./pages/coupons/CouponForm";
import BundleList from "./pages/bundles/BundleList";
import BundleForm from "./pages/bundles/BundleForm";
import StorePage from "./pages/store/StorePage";

function ProtectedRoute({ children }) {
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupons/new" element={<CouponForm />} />
          <Route path="coupons/:id/edit" element={<CouponForm />} />
          <Route path="bundles" element={<BundleList />} />
          <Route path="bundles/new" element={<BundleForm />} />
          <Route path="bundles/:id/edit" element={<BundleForm />} />
          <Route path="store" element={<StorePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
