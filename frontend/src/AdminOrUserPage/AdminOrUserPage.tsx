import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminOrUserPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ดึง role จาก localStorage
    const userRole = localStorage.getItem("role");

    if (!userRole) {
      navigate("/login"); // ถ้ายังไม่ได้ login ให้ไปที่หน้า login
    } else if (userRole === "admin") {
      navigate("/admin"); // ถ้าเป็น admin ให้ไปหน้า AdminPage
    } else if (userRole === "user") {
      navigate("/user"); // ถ้าเป็น user ให้ไปหน้า UserPage
    }
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h1>Loading...</h1>
    </div>
  );
};

export default AdminOrUserPage;
