// import { DollarSign, ShieldCheck, ShoppingCart, Users } from "lucide-react"

function DashboardSuperAdmin() {


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold">Dashboard</h1>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title mb-0">ยอดขายทั้งหมด</h6>
                <i className="bi bi-currency-dollar text-muted"></i>
              </div>
              <h4>฿1,250,000</h4>
              <small className="text-muted">+15% จากเดือนที่แล้ว</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title mb-0">ผู้ใช้ทั้งหมด</h6>
                <i className="bi bi-people text-muted"></i>
              </div>
              <h4>1,250</h4>
              <small className="text-muted">+25 ในสัปดาห์นี้</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title mb-0">แอดมิน</h6>
                <i className="bi bi-shield-check text-muted"></i>
              </div>
              <h4>8</h4>
              <small className="text-muted">+2 ในเดือนนี้</small>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content " id="dashboardTabsContent">
        {/* Overview Tab */}
        <div
          className="tab-pane fade show active"
          id="overview"
          role="tabpanel"
        >
          <div className="row g-4">
            {/* กิจกรรมล่าสุด */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">กิจกรรมล่าสุด</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3 border-bottom pb-2">
                    <strong>เพิ่มแอดมินใหม่</strong>
                    <p className="mb-1 text-muted small">
                      สมชาย ใจดี ถูกเพิ่มเป็นแอดมิน
                    </p>
                    <small className="text-muted">2 ชั่วโมงที่แล้ว</small>
                  </div>
                  <div className="mb-3 border-bottom pb-2">
                    <strong>อัปเดตสินค้า</strong>
                    <p className="mb-1 text-muted small">
                      อัปเดตสินค้า 15 รายการ
                    </p>
                    <small className="text-muted">5 ชั่วโมงที่แล้ว</small>
                  </div>
                  <div>
                    <strong>บำรุงรักษาระบบเสร็จสิ้น</strong>
                    <p className="mb-1 text-muted small">
                      การปรับปรุงฐานข้อมูลเสร็จสมบูรณ์
                    </p>
                    <small className="text-muted">12 ชั่วโมงที่แล้ว</small>
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
export default DashboardSuperAdmin;
