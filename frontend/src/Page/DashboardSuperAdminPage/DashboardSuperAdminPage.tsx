import { useState } from "react";
import DashboardSuperAdmin from "../../Components/DashboardSuperAdmin";
import SidebarSuperAdmin from "../../Components/SidebarSuperAdmin";
import TopBar from "../../Components/TopBar";


function DashboardSuperAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <div className="min-vh-100 d-flex">
        <SidebarSuperAdmin
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-grow-1 bg-light">
          <TopBar />
          <DashboardSuperAdmin />
        </div>
      </div>
    </>
  );
}

export default DashboardSuperAdminPage;
