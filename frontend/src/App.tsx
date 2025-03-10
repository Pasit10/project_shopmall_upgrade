import { Routes, Route } from "react-router-dom";
import CategoryPage from "./Page/CategoryPage/CategoryPage";
import HomePage from "./Page/HomePage/HomePage";
import LoginPage from "./Page/LoginPage/LoginPage";
import RegisterPage from "./Page/RegisterPage/RegisterPage";
import AdminPage from "./Page/AdminPage/AdminPage";
import AdminProductPage from "./Page/ProductAdminPage/ProductAdminPage";
import OrdersAdminPage from "./Page/OrdersAdminPage/OrdersAdminPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/product" element={<AdminProductPage/>} />
      <Route path="/admin/orders" element={<OrdersAdminPage/>} />
    </Routes>
  );
}

export default App;
