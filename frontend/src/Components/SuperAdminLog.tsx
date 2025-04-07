import React, { useEffect, useState } from "react";
import type AdminActivityLog from "../Types/AdminActivityLog";
import axiosInstance from "../utils/axios";

const SuperAdminLog: React.FC = () => {
  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminLogs = async () => {
      try {
        const response = await axiosInstance.get("/admin/transaction_log");
        if (response.status === 200) {
          setAdminLogs(response.data);
        } else {
          console.error("Failed to fetch admin logs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching admin logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminLogs();
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f9fc", minHeight: "100vh", padding: "40px" }}>
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Admin Activity Report</h2>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <p>Loading logs...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>TransactionID</th>
                      <th>No</th>
                      <th>Status</th>
                      <th>Admin ID</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLogs.length > 0 ? (
                      adminLogs.map((log,index) => (
                        <tr key={index}>
                          <td>{log.idtransaction}</td>
                          <td>{log.seq}</td>
                          <td>{log.statusname}</td>
                          <td>{log.uid}</td>
                          <td>{log.timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="text-end text-muted mt-3" style={{ fontSize: "12px" }}>
                  Generated on: {new Date().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLog;