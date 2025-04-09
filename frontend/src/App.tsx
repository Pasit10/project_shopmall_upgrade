import { Routes, Route } from "react-router-dom";
import CategoryPage from "./Page/CategoryPage/CategoryPage";
import HomePage from "./Page/HomePage/HomePage";
import LoginPage from "./Page/LoginPage/LoginPage";
import RegisterPage from "./Page/RegisterPage/RegisterPage";
import AdminPage from "./Page/AdminPage/AdminPage";
import AdminProductPage from "./Page/ProductAdminPage/ProductAdminPage";
import OrdersAdminPage from "./Page/OrdersAdminPage/OrdersAdminPage";
import ProductPage from "./Page/ProductPage/ProductPage";
import AdminHomePage from "./Page/AdminHomePage/AdminHomePage";
import CartList from "./Components/CartList";
import ProductDetailPage from "./Page/ProductDetailPage/ProductDetailPage";
import ProfilePage from "./Page/ProfilePage/ProfilePage";
import SuperAdminPage from "./Page/SuperAdminPage/SuperAdminPage";
import SuperAdminLogPage from "./Page/SuperAdminLogPage/SuperAdminLogPage";
import DashboardSuperAdminPage from "./Page/DashboardSuperAdminPage/DashboardSuperAdminPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider, useAuth } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth(); // ดึงข้อมูล currentUser จาก AuthContext

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop" element={<ProductPage />} />
      <Route path="/cart" element={<CartList />} />
      <Route path="/product/:product_id" element={<ProductDetailPage />} />

      {/* 🔒 Requires login */}
      <Route path="/profile" element={
        <ProtectedRoute currentUser={currentUser}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* 🔒 Admin only */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin" currentUser={currentUser}>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/homeadmin" element={
        <ProtectedRoute role="admin" currentUser={currentUser}>
          <AdminHomePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/product" element={
        <ProtectedRoute role="admin" currentUser={currentUser}>
          <AdminProductPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute role="admin" currentUser={currentUser}>
          <OrdersAdminPage />
        </ProtectedRoute>
      } />

      {/* 🔒 Superadmin only */}
      <Route path="/superadmin" element={
        <ProtectedRoute role="superadmin" currentUser={currentUser}>
          <DashboardSuperAdminPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/manageadmin" element={
        <ProtectedRoute role="superadmin" currentUser={currentUser}>
          <SuperAdminPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/log" element={
        <ProtectedRoute role="superadmin" currentUser={currentUser}>
          <SuperAdminLogPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;