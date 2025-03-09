import { Routes, Route } from "react-router-dom";
import CategoryPage from "./Page/CategoryPage/CategoryPage";
import HomePage from "./Page/HomePage/HomePage";
import LoginPage from "./Page/LoginPage/LoginPage";
import RegisterPage from "./Page/RegisterPage/RegisterPage";
import AdminPage from "./Page/AdminPage/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
