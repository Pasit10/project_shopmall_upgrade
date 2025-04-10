import { LayoutDashboard, Menu, X, ShoppingBag, FileText } from "lucide-react";
import SidebarProps from "../Types/SidebarProps";
import { Link } from "react-router-dom"; // Import Link

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
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
          <Link to="/admin" className="nav-link text-white mb-3 d-flex align-items-center">
            <LayoutDashboard size={24} />
            {sidebarOpen && <span className="ms-3">Home</span>}
          </Link>
          <Link to="/admin/product" className="nav-link text-white mb-3 d-flex align-items-center">
            <ShoppingBag size={24} />
            {sidebarOpen && <span className="ms-3">Products</span>}
          </Link>
          <Link to="/admin/orders" className="nav-link text-white mb-3 d-flex align-items-center">
            <FileText size={24} />
            {sidebarOpen && <span className="ms-3">Orders</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
