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
    // Get the product ID from formData
    const productId = formData.id;
    // Convert stock_qty_frontend to a number
    const newQuantity = Number(formData.stock_qty_frontend);
    // Send only product ID and quantity to the parent component
    await onSubmit(productId, newQuantity);
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
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_qty_frontend"
                  value={formData.stock_qty_frontend}
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
