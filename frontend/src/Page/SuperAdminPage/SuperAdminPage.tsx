import { useCallback, useEffect, useState } from "react";
import  AdminManagement  from "../../Components/AdminManagement";
import SidebarSuperAdmin from "../../Components/SidebarSuperAdmin";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import TopBar from "../../Components/TopBar";

function SuperAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
        const response = await axiosInstance.get("/user/me", { withCredentials: true });
        if (response.status === 200) {
            const { role } = response.data;
            if (role !== "superadmin") {
                navigate("/");
            }
        }else if(response.data === 401){
          navigate("/");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
      fetchUser();
  }, [fetchUser]);
  return (
    <>
      <div className="min-vh-100 d-flex">
        <SidebarSuperAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-grow-1 bg-light">
          <TopBar />
          <AdminManagement />
        </div>
      </div>
    </>
  );
}

export default SuperAdminPage;
