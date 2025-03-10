import { LayoutDashboard, Menu, X, ShoppingBag, FileText, Settings } from "lucide-react";
import SidebarProps from "../Types/SidebarProps";


const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`bg-dark text-white ${sidebarOpen ? "width-280" : "width-70"}`} style={{ transition: "width 0.3s" }}>
      <div className="p-3 d-flex justify-content-between align-items-center">
        {sidebarOpen && <span className="fs-4">LUXE Admin</span>}
        <button className="btn btn-link text-white p-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className="p-3">
        <div className={`nav flex-column ${!sidebarOpen && "align-items-center"}`}>
          <a href="/admin" className="nav-link text-white mb-3 d-flex align-items-center">
            <LayoutDashboard size={24} />
            {sidebarOpen && <span className="ms-3">Home</span>}
          </a>
          <a href="/admin/product" className="nav-link text-white mb-3 d-flex align-items-center">
            <ShoppingBag size={24} />
            {sidebarOpen && <span className="ms-3">Products</span>}
          </a>
          <a href="/admin/orders" className="nav-link text-white mb-3 d-flex align-items-center">
            <FileText size={24} />
            {sidebarOpen && <span className="ms-3">Orders</span>}
          </a>
          <a href="#" className="nav-link text-white mb-3 d-flex align-items-center">
            <Settings size={24} />
            {sidebarOpen && <span className="ms-3">Settings</span>}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
