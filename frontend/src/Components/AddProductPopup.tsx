import React, { useEffect, useState } from "react";
import Product from "../Types/Product";
import AddProductPopupProps from "../Types/AddProductPopupProps";

const AddProductPopup: React.FC<AddProductPopupProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    product_name: "",
    price_per_unit: 0,
    cost_per_unit: 0,
    detail: "",
    stock_qty_frontend: 0,
    stock_qty_backend: 0,
    product_image: "",
    typeid: 1,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      stock_qty_frontend: prev.stock_qty_backend,
    }));
  }, [formData.stock_qty_backend]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name === "stock" ? "stock_qty_backend" : name]:
        name === "product_name" || name === "detail" || name === "product_image"
          ? value || undefined
          : name === "typeid"
          ? value
          : value === ""
          ? undefined
          : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();
    await onSubmit(formData as Product); // รอให้ onSubmit ทำงานเสร็จ 
    resetForm();
  };

  const handleClose = () => {
    resetForm(); // Reset form when modal is closed
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      price_per_unit: 0,
      cost_per_unit: 0,
      detail: "",
      stock_qty_frontend: 0,
      stock_qty_backend: 0,
      product_image: "",
      typeid: 1,
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Add Product
      </button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add New Product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
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
                    value={formData.product_name || ""}
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
                    value={formData.price_per_unit ?? ""}
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
                    value={formData.cost_per_unit ?? ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Detail</label>
                  <input
                    type="text"
                    className="form-control"
                    name="detail"
                    value={formData.detail || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock_qty_backend ?? ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">FurnitureType</label>
                  <select
                    className="form-select"
                    name="typeid"
                    value={formData.typeid}
                    onChange={handleChange}
                  >
                    <option value={1}>LivingRoom</option>
                    <option value={2}>BedRoom</option>
                    <option value={3}>BathRoom</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductPopup;
