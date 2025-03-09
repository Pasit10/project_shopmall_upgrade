import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShoppingBag,
  FileText,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import useStats from "../hook/useStat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      data: [30, 45, 35, 50, 40, 60],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const stats = useStats();
  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white ${
          sidebarOpen ? "width-280" : "width-70"
        }`}
        style={{ transition: "width 0.3s" }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center ">
          {sidebarOpen && <span className="fs-4">LUXE Admin</span>}
          <button
            className="btn btn-link text-white p-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="p-3">
          <div
            className={`nav flex-column ${
              !sidebarOpen && "align-items-center"
            }`}
          >
            <a
              href="/admin"
              className="nav-link text-white mb-3 d-flex align-items-center"
            >
              <LayoutDashboard size={24} />
              {sidebarOpen && <span className="ms-3">Dashboard</span>}
            </a>
            <a
              href="#"
              className="nav-link text-white mb-3 d-flex align-items-center"
            >
              <ShoppingBag size={24} />
              {sidebarOpen && <span className="ms-3">Products</span>}
            </a>
            <a
              href="#"
              className="nav-link text-white mb-3 d-flex align-items-center"
            >
              <FileText size={24} />
              {sidebarOpen && <span className="ms-3">Orders</span>}
            </a>
            <a
              href="#"
              className="nav-link text-white mb-3 d-flex align-items-center"
            >
              <Settings size={24} />
              {sidebarOpen && <span className="ms-3">Settings</span>}
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Top Bar */}
        <div className="bg-white px-4 py-3 d-flex justify-content-end align-items-center ">
          <button className="btn btn-link text-dark p-2 position-relative">
            <Bell className="me-1" size={20} />
          </button>
          <button className="btn btn-link text-dark p-2 position-relative">
            <Settings className="me-1" size={20} />
          </button>
          <button className="btn btn-link text-dark p-2 position-relative">
            <LogOut className="me-1" size={20} onClick={() => navigate("/")} />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4">
          <div className="row g-4">
            {/* Stats Cards */}
            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center">
                  <Users size={40} className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Total Users</h6>
                    <h3 className="mb-0">
                      {stats.totalUsers.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center">
                  <Package size={40} className="text-success me-3" />
                  <div>
                    <h6 className="mb-0">Products</h6>
                    <h3 className="mb-0">{stats.products.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center">
                  <ShoppingCart size={40} className="text-warning me-3" />
                  <div>
                    <h6 className="mb-0">Orders</h6>
                    <h3 className="mb-0">{stats.orders.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center">
                  <DollarSign size={40} className="text-danger me-3" />
                  <div>
                    <h6 className="mb-0">Revenue</h6>
                    <h3 className="mb-0">${stats.revenue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="col-md-8">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Sales Overview</h5>
                  <Line data={salesData} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Recent Orders</h5>
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#1234</td>
                        <td>John Doe</td>
                        <td>
                          <span className="badge bg-success">Completed</span>
                        </td>
                      </tr>
                      <tr>
                        <td>#1235</td>
                        <td>Jane Smith</td>
                        <td>
                          <span className="badge bg-warning">Pending</span>
                        </td>
                      </tr>
                      <tr>
                        <td>#1236</td>
                        <td>Mike Johnson</td>
                        <td>
                          <span className="badge bg-info">Processing</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">Recent Products</h5>
                    <button className="btn btn-primary btn-sm">
                      Add New Product
                    </button>
                  </div>
                  <table className="table table-hover text-center">
                    <thead>
                      <tr>
                        <th className="align-middle">Product ID</th>
                        <th className="align-middle">Name</th>
                        <th className="align-middle">Category</th>
                        <th className="align-middle">Price</th>
                        <th className="align-middle">Stock</th>
                        <th className="align-middle">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="align-middle">#P001</td>
                        <td className="align-middle">Modern Sofa</td>
                        <td className="align-middle">Furniture</td>
                        <td className="align-middle">$899</td>
                        <td className="align-middle">15</td>
                        <td className="align-middle">
                          <button className="btn btn-outline-primary btn-sm me-2">
                            Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
