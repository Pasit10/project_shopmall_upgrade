import { LayoutDashboard, Menu, X, ShoppingBag, FileText } from "lucide-react";
import SidebarProps from "../Types/SidebarProps";
import { Link } from "react-router-dom";

const SidebarSuperAdmin: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`bg-dark text-white ${sidebarOpen ? "width-280" : "width-70"}`} style={{ transition: "width 0.3s" }}>
      <div className="p-3 d-flex justify-content-between align-items-center">
        <Link to="/" className="nav-link text-white mb-3 d-flex align-items-center">
          {sidebarOpen && <span className="fs-4">LUXE SHOP</span>}
        </Link>
        <button className="btn btn-link text-white p-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="mb-3" size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className="p-3">
        <div className={`nav flex-column ${!sidebarOpen && "align-items-center"}`}>
          <Link to="/superadmin" className="nav-link text-white mb-3 d-flex align-items-center">
            <FileText size={24} />
            {sidebarOpen && <span className="ms-3">Dashboard</span>}
          </Link>
          <Link to="/superadmin/manageadmin" className="nav-link text-white mb-3 d-flex align-items-center">
            <LayoutDashboard size={24} />
            {sidebarOpen && <span className="ms-3">AdminManageMent</span>}
          </Link>
          <Link to="/superadmin/log" className="nav-link text-white mb-3 d-flex align-items-center">
            <ShoppingBag size={24} />
            {sidebarOpen && <span className="ms-3">AdminLog</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarSuperAdmin;
