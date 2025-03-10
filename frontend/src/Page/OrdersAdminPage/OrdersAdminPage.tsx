import TopBar from "../../Components/TopBar";
import Sidebar from "../../Components/Sidebar";
import { useState } from "react";
import { Package2 } from "lucide-react";
const orders = [
  {
    id: "#1234",
    name: "John smith",
    status: "Completed",
    date: "2025/01/01",
  },
  {
    id: "#1235",
    name: "Jane Smith",
    status: "Pending",
    date: "2025/01/01",
  },
  {
    id: "#1236",
    name: "Mike Johnson",
    status: "Processing",
    date: "2025/01/01",
  },
  {
    id: "#1236",
    name: "Mike Johnson",
    status: "Processing",
    date: "2025/01/01",
  },
  {
    id: "#1236",
    name: "Mike Johnson",
    status: "Processing",
    date: "2025/01/01",
  },
  {
    id: "#1236",
    name: "Mike Johnson",
    status: "Processing",
    date: "2025/01/01",
  },
];

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-success text-white";
    case "pending":
      return "bg-warning text-dark";
    case "processing":
      return "bg-info text-white";
    default:
      return "bg-secondary text-white";
  }
};

function OrdersAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-vh-100 d-flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-grow-1 bg-light">
        <TopBar />
        <div className="min-vh-90 bg-light py-5">
          <div className="container-fluid">
            <div className="row justify-content-center text-center">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="card-title fw-bold m-0 d-flex align-items-center">
                        <Package2 className="me-2" size={24} />
                        Recent Orders
                      </h5>
                      <span className="text-muted small">
                        Total {orders.length} orders
                      </span>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-2">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0">Order ID</th>
                            <th className="border-0">Customer</th>
                            <th className="border-0">Date</th>
                            <th className="border-0">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {" "}
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="fw-medium">{order.id}</td>
                              <td>
                                <div>
                                  <span className="fw-medium">
                                    {order.name}
                                  </span>
                                </div>
                              </td>
                              <td>{order.date}</td>
                              <td>
                                <span
                                  className={`badge rounded-pill ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {order.status}{" "}
                                </span>
                              </td>
                            </tr>
                          ))}{" "}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersAdminPage;
