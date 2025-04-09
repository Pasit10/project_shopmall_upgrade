import { useState } from "react";
import AdminLog from "../../Components/SuperAdminLog"
import SidebarSuperAdmin from "../../Components/SidebarSuperAdmin";
import TopBar from "../../Components/TopBar";



function SuperAdminLogPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <div className="min-vh-100 d-flex">
        <SidebarSuperAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-grow-1 bg-light">
            <TopBar />
            <AdminLog/>
          </div>
      </div>
    </>
  )
}

export default SuperAdminLogPage