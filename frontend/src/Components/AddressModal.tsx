import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstant from "../utils/axios";

interface AddressModalProps {
  show: boolean;
  onClose: () => void;
  initialData: {
    address: string;
    tel: string;
  };
  onSave: (updatedData: { address: string; tel: string }) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  show,
//   onClose,
  initialData,
  onSave,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: initialData.address || "",
    tel: initialData.tel || "",
  });

  // Update local state when props change
  React.useEffect(() => {
    setFormData({
      address: initialData.address || "",
      tel: initialData.tel || "",
    });
  }, [initialData]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update user info with the provided address and tel
      const response = await axiosInstant.put("/user/update", formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        onSave(formData);
        alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">กรุณากรอกข้อมูลเพิ่มเติม</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => navigate("/profile")}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  ที่อยู่
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/profile")}
              >
                ไปยังหน้าโปรไฟล์
              </button>
              <button type="submit" className="btn btn-primary">
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;