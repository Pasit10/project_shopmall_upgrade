import React from "react";
import { ShoppingBag, MapPin, Phone, Calendar, Mail } from "lucide-react";
import { UserProfile } from "../Types/UserProfile";
import { PurchaseHistory } from "../Types/PurchaseHistory";

// Mock data
const userProfile: UserProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
  address: "123 Furniture Street, Design District, Bangkok 10110",
  phoneNumber: "+66 98 765 4321",
  memberSince: "January 2023",
};

const purchaseHistory: PurchaseHistory[] = [
  {
    id: "1",
    productName: "Modern Leather Sofa",
    price: 45000,
    purchaseDate: "2024-03-10",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    status: "delivered",
  },
  {
    id: "2",
    productName: "Minimalist Coffee Table",
    price: 12000,
    purchaseDate: "2024-02-25",
    image:
      "https://images.unsplash.com/photo-1565374395542-0ce18882c857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    status: "shipping",
  },{
    id: "3",
    productName: "Minimalist Coffee Table",
    price: 12000,
    purchaseDate: "2024-02-25",
    image:
      "https://images.unsplash.com/photo-1565374395542-0ce18882c857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    status: "shipping",
  }
];

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

const badgeStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  borderRadius: "30px",
  fontWeight: 500,
};

function Profile() {
  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#f8f9fa", fontFamily: "'Prompt', sans-serif" }}
    >
      <div className="container d-flex justify-content-center align-items-center mb-5"style={{ height: "80vh" }}> 
        <div className="row g-4 mb-5">
          {/* Profile Section */}
          <div className="col-lg-5 ">
            <div className="card h-100" style={cardStyle}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={userProfile.avatar}
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
                  <h2 className="h3 mt-4 mb-1 fw-semibold">
                    {userProfile.name}
                  </h2>
                  <div className="d-flex align-items-center justify-content-center text-muted">
                    <Mail size={16} className="me-2" />
                    <span>{userProfile.email}</span>
                  </div>
                </div>

                <div className="border-top pt-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3" style={iconContainerStyle}>
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-semibold">ที่อยู่จัดส่ง</h6>
                      <span className="text-muted">{userProfile.address}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3" style={iconContainerStyle}>
                      <Phone size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-semibold">เบอร์โทรศัพท์</h6>
                      <span className="text-muted">
                        {userProfile.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="me-3" style={iconContainerStyle}>
                      <Calendar size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-semibold">สมาชิกตั้งแต่</h6>
                      <span className="text-muted">
                        {userProfile.memberSince}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase History Section */}
          <div className="col-lg-7">
            <div className="card h-100" style={cardStyle}>
              <div className="card-header bg-white border-0 p-4">
                <div className="d-flex align-items-center">
                  <div className="me-3" style={iconContainerStyle}>
                    <ShoppingBag size={24} className="text-primary" />
                  </div>
                  <h3 className="h4 mb-0 fw-semibold">ประวัติการสั่งซื้อ</h3>
                </div>
              </div>
              <div className="card-body p-4">
                {purchaseHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="d-flex align-items-center p-3 mb-3 rounded-3"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={purchase.image}
                      alt={purchase.productName}
                      className="rounded-3 me-4"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-semibold">
                          {purchase.productName}
                        </h5>
                        <span
                          className={`badge bg-${
                            purchase.status === "delivered"
                              ? "success"
                              : purchase.status === "shipping"
                              ? "primary"
                              : "warning"
                          }`}
                          style={badgeStyle}
                        >
                          {purchase.status === "delivered"
                            ? "จัดส่งแล้ว"
                            : purchase.status === "shipping"
                            ? "กำลังจัดส่ง"
                            : "กำลังดำเนินการ"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                          สั่งซื้อเมื่อ{" "}
                          {new Date(purchase.purchaseDate).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="h5 mb-0 fw-semibold">
                          ฿{purchase.price.toLocaleString()}
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
  );
}

export default Profile;
