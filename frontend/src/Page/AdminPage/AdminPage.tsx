import {useState} from "react";
import {Line} from "react-chartjs-2";
import useStats from "../../hooks/useStat";
import Sidebar from "../../Components/Sidebar";
import TopBar from "../../Components/TopBar";
import {Users, Package, DollarSign, ShoppingCart} from "lucide-react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const salesData = {
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun"
	],
	datasets: [
		{
			label: "Sales",
			data: [
				30,
				45,
				35,
				50,
				40,
				60
			],
			fill: false,
			borderColor: "rgb(75, 192, 192)",
			tension: 0.1
		},
	]
};

function AdminPage() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const stats = useStats();

	return (
		<div className="min-vh-100 d-flex">
			<Sidebar sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}/>
			<div className="flex-grow-1 bg-light">
				<TopBar/>
				<div className="p-4">
					<div className="row g-4">
						{/* Stats Cards */}
						<div className="col-md-3">
							<div className="card h-100">
								<div className="card-body d-flex align-items-center">
									<Users size={40}
										className="text-primary me-3"/>
									<div>
										<h6 className="mb-0">Total Users</h6>
										<h3 className="mb-0">
											{
											stats.totalUsers.toLocaleString()
										}</h3>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-3">
							<div className="card h-100">
								<div className="card-body d-flex align-items-center">
									<Package size={40}
										className="text-success me-3"/>
									<div>
										<h6 className="mb-0">Products</h6>
										<h3 className="mb-0">
											{
											stats.products.toLocaleString()
										}</h3>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-3">
							<div className="card h-100">
								<div className="card-body d-flex align-items-center">
									<ShoppingCart size={40}
										className="text-warning me-3"/>
									<div>
										<h6 className="mb-0">Orders</h6>
										<h3 className="mb-0">
											{
											stats.orders.toLocaleString()
										}</h3>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-3">
							<div className="card h-100">
								<div className="card-body d-flex align-items-center">
									<DollarSign size={40}
										className="text-danger me-3"/>
									<div>
										<h6 className="mb-0">Revenue</h6>
										<h3 className="mb-0">${
											stats.revenue.toLocaleString()
										}</h3>
									</div>
								</div>
							</div>
						</div>

						{/* Sales Chart */}
						<div className="col-md-8">
							<div className="card h-100">
								<div className="card-body">
									<h5 className="card-title">Sales Overview</h5>
									<Line data={salesData}/>
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
										<button className="btn btn-primary btn-sm">Add New Product</button>
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
													<button className="btn btn-outline-primary btn-sm me-2">Edit</button>
													<button className="btn btn-outline-danger btn-sm">Delete</button>
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
