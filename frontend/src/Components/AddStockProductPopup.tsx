import React, { useState, useEffect } from "react";
import Product from "../Types/Product";
import AddStockProductPopupProps from "../Types/AddStockProductPopupProps";

const AddProductPopup: React.FC<AddStockProductPopupProps> = ({
  product,
  onSubmit,
  modalId
}) => {
  const [formData, setFormData] = useState<Product>(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // แยกค่า stock สำหรับ frontend และ backend
    const parsedData = {
      ...formData,
      stock_qty_frontend: Number(formData.stock_qty_frontend),  // เก็บค่า stock สำหรับ frontend
      stock_qty_backend: Number(formData.stock_qty_backend),    // เก็บค่า stock สำหรับ backend
    };

    console.log("🚀 Submitting Add Product Stock with data:", parsedData);
    await onSubmit(parsedData);
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Add Product Stock</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Stock Quantity (Frontend)</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_qty_frontend"
                  value={formData.stock_qty_frontend}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Stock Quantity (Backend)</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_qty_backend"
                  value={formData.stock_qty_backend}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPopup;
