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


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop" element={<ProductPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/homeadmin" element={<AdminHomePage/>} />
      <Route path="/admin/product" element={<AdminProductPage/>} />
      <Route path="/admin/orders" element={<OrdersAdminPage/>} />
      <Route path="/cart" element={<CartList/>} />
      <Route path="/product/:product_id" element={<ProductDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
