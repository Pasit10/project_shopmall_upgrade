import React, { useEffect, useState } from "react";
import { ShoppingBag, MapPin, Phone, Mail } from "lucide-react";
import { UserProfile } from "../Types/UserProfile";
import { Transaction } from "../Types/PurchaseHistory";
import axiosInstance from "../utils/axios";


const cardStyle: React.CSSProperties = {
  borderRadius: "20px",
  border: "none",
  boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
};

const iconContainerStyle: React.CSSProperties = {
  backgroundColor: "rgba(13, 110, 253, 0.1)",
  borderRadius: "50%",
  padding: "12px",
};

// const badgeStyle: React.CSSProperties = {
//   padding: "0.6rem 1rem",
//   borderRadius: "30px",
//   fontWeight: 500,
// };

function Profile() {
  const [user, setUser] = useState<UserProfile>();
  const [purchaseHistory, setPurchaseHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data);
        }

        const response2 = await axiosInstance.get("/user/transaction", {
          withCredentials: true,
        });

        if (response2.status === 200) {
          setPurchaseHistory(response2.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }


  return (
    <div
      className="container-fluid py-5"
      style={{ fontFamily: "'Prompt', sans-serif", minHeight: "80vh" }}
    >
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="col-lg-11 col-xl-10">
          <div className="row">
            {/* Profile Section */}
            <div className="col-lg-5 col-md-6 mb-4">
              <div className="card" style={{ ...cardStyle, height: "100%" }}>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="rounded-circle border border-4 border-white"
                        style={{
                          width: "180px",
                          height: "180px",
                          objectFit: "cover",
                          boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
                        }}
                      />
                    </div>
                    <h2 className="h3 mt-4 mb-1 fw-semibold">{user.name}</h2>
                    <div className="d-flex align-items-center justify-content-center text-muted">
                      <Mail size={16} className="me-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="border-top pt-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3" style={iconContainerStyle}>
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-semibold">ที่อยู่จัดส่ง</h6>
                        <span className="text-muted">{user.address}</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3" style={iconContainerStyle}>
                        <Phone size={24} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-semibold">เบอร์โทรศัพท์</h6>
                        <span className="text-muted">{user.tel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase History Section */}
            <div className="col-lg-7 col-md-6 mb-4">
              <div className="card" style={{ ...cardStyle, height: "100%" }}>
                <div className="card-header bg-white border-0 p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3" style={iconContainerStyle}>
                      <ShoppingBag size={24} className="text-primary" />
                    </div>
                    <h3 className="h4 mb-0 fw-semibold">ประวัติการสั่งซื้อ</h3>
                  </div>
                </div>
                <div className="card-body p-4">
                {purchaseHistory.map((transaction) => (
                  <div
                    key={transaction.idtransaction}
                    className="d-flex align-items-center p-3 mb-3 rounded-3"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-semibold">
                          รายการสั่งซื้อ #{transaction.idtransaction}
                        </h5>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted">
                          สินค้า: {transaction.transaction_details.reduce((acc, item) => acc + item.qty, 0)} ชิ้น
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                          สั่งซื้อเมื่อ {transaction.timestamp}
                        </span>
                        <span className="h5 mb-0 fw-semibold">
                          ฿{transaction.totalprice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
