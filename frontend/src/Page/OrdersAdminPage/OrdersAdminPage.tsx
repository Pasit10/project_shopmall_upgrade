import TopBar from "../../Components/TopBar";
import Sidebar from "../../Components/Sidebar";
import { useState, useEffect } from "react";
import { Package2 } from "lucide-react";
import axios from "axios";
import axiosInstance from "../../utils/axios";
import Transaction from "../../Types/Transaction";
import { useNavigate } from "react-router-dom";

// Array of statuses
const statusList: string[] = [
  "ยังไม่รับออเดอร์",
  "รับออเดอร์",
  "เริ่มแพคเกจ",
  "ส่งแพคเกจแล้ว",
  "ส่งให้ขนส่ง",
  "ยกเลิกออเดอร์",
];
const getStatusBadgeClass = (statusName: string): string => {
  switch (statusName.toLowerCase()) {
    case "ยังไม่รับออเดอร์":
      return "bg-warning text-dark";
    case "รับออเดอร์":
      return "bg-info text-white";
    case "เริ่มแพคเกจ":
      return "bg-primary text-white";
    case "ส่งแพคเกจแล้ว":
      return "bg-info text-white";
    case "ส่งให้ขนส่ง":
      return "bg-success text-white";
    case "ยกเลิกออเดอร์":
      return "bg-danger text-white";
    default:
      return "bg-secondary text-white";
  }
};


function OrdersAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/transaction", {withCredentials: true});

        if (response.status === 200) {
          setTransactions(response.data);
          setLoading(false);
        }else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

      } catch (err: unknown) {
        console.error("Error fetching transactions:", err);
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.english_description || "An error occurred");
        }
      }
    };


    fetchTransactions();
  }, [navigate]);


  const handleUpdateTransaction = async (transactionId: number, newstatus: number) => {
    try {
      const response = await axiosInstance.get('/admin/transaction_update', {
        params: {
          tranxId: transactionId,
          statusID: newstatus
        },
        withCredentials: true
      });
      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) => {
            if (transaction.idtransaction === transactionId) {
              // ห้ามเปลี่ยนจาก status 5 → 6
              if (transaction.idstatus === 5 && newstatus === 6) {
                return transaction; // ไม่อัปเดต
              }
              console.log(newstatus);
              return {
                ...transaction,
                idstatus: newstatus,
                statusname: statusList[newstatus - 1], // -1 because statusList is 0-indexed
              };
            }
            return transaction;
          })
        );
        setError(null);
        alert("อัพเดทสถานะสำเร็จ");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }catch (err) {
      console.error("Error updating transaction:", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.english_description || "An error occurred");
      }
    }
  }

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-grow-1 bg-light">
        <TopBar />
        <div className="min-vh-90 bg-light py-5">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="card-title fw-bold m-0 d-flex align-items-center">
                        <Package2 className="me-2" size={24} />
                        รายการคำสั่งซื้อ
                      </h5>
                      <span className="text-muted small">
                        ทั้งหมด {transactions.length} รายการ
                      </span>
                    </div>

                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">กำลังโหลด...</span>
                        </div>
                        <p className="mt-2">กำลังโหลดข้อมูล...</p>
                      </div>
                    ) : error ? (
                      <div className="alert alert-danger" role="alert">
                        เกิดข้อผิดพลาด: {error}
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-2">
                          <thead className="table-light">
                            <tr>
                              <th className="border-0">รหัสคำสั่งซื้อ</th>
                              <th className="border-0">เวลา</th>
                              <th className="border-0">ยอดรวม</th>
                              <th className="border-0">VAT</th>
                              <th className="border-0">สถานะ</th>
                              <th className="border-0 text-center" style={{ width: "200px" }}>
                                การดำเนินการ
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction) => (
                              <tr key={transaction.idtransaction}>
                                <td className="fw-medium">#{transaction.idtransaction}</td>
                                <td>{transaction.timestamp}</td>
                                <td>{transaction.totalprice}</td>
                                <td>{transaction.vat}</td>
                                <td>
                                  <span
                                    className={`badge rounded-pill ${getStatusBadgeClass(
                                      transaction.statusname
                                    )}`}
                                  >
                                    {transaction.statusname}
                                  </span>
                                </td>
                                <td className="text-center">
                                 <div className="d-flex justify-content-center gap-2">
                                   <button className="btn btn-sm btn-success"
                                     onClick={() => handleUpdateTransaction(transaction.idtransaction, transaction.idstatus + 1)}
                                   >
                                     Accept
                                   </button>
                                   <button className="btn btn-sm btn-danger"
                                     onClick={() => handleUpdateTransaction(transaction.idtransaction, transaction.idstatus - 1)}
                                   >
                                     Reject
                                   </button>
                                   <button className="btn btn-sm btn-secondary"
                                     onClick={() => handleUpdateTransaction(transaction.idtransaction, 6)}
                                   >
                                     Cancel
                                   </button>
                                 </div>
                               </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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