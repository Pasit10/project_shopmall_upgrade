import React, { useState, useEffect } from "react";
import Product from "../Types/Product";
import EditProductPopupProps from "../Types/EditProductPopupProps";

const EditProductPopup: React.FC<EditProductPopupProps> = ({
  product,
  onSubmit,
  modalId,
}) => {
  const [formData, setFormData] = useState<Product>(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const parsedData = {
      ...formData,
      price_per_unit: Number(formData.price_per_unit),
      cost_per_unit: Number(formData.cost_per_unit),
      typeid: Number(formData.typeid),
    };
  
    console.log("🚀 Submitting form with data:", parsedData);
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
            <h1 className="modal-title fs-5">Edit Product</h1>
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
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price per Unit</label>
                <input
                  type="number"
                  className="form-control"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cost per Unit</label>
                <input
                  type="number"
                  className="form-control"
                  name="cost_per_unit"
                  value={formData.cost_per_unit}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Detail</label>
                <textarea
                  className="form-control"
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Furniture Type</label>
                <select
                  className="form-select"
                  name="typeid"
                  value={formData.typeid}
                  onChange={handleChange}
                >
                  <option value={1}>Living Room</option>
                  <option value={2}>Bedroom</option>
                  <option value={3}>Bathroom</option>
                </select>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPopup;