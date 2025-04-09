import TopBar from "../../Components/TopBar";
import Sidebar from "../../Components/Sidebar";
import { useEffect, useState } from "react";
import { Package2 } from "lucide-react";
import Product from "../../Types/Product";
import AddProductPopup from "../../Components/AddProductPopup";
import axiosInstance from "../../utils/axios";
import EditProductPopup from "../../Components/EditProductPopup";
import AddStockProductPopup from "../../Components/AddStockProductPopup";

function AdminProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/product/", {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // ป้องกันข้อผิดพลาดใน UI
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSubmit = async (product: Product) => {
    try {
      const response = await axiosInstance.post("/product/", product, {
        withCredentials: true,
      });
      setProducts((prevProducts) => [...(prevProducts || []), response.data]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleProductUpdate = async (updatedProduct: Product) => {
    try {
      const response = await axiosInstance.put(
        `/product/${updatedProduct.id}`,
        updatedProduct,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddStockProductUpdate = async (product_id: number, newQty: number) => {
    //productJWT.Put("/qty/:product_id", gateways.UpdateQtyProduct)
    try {
      const response = await axiosInstance.put(
        `/product/qty/${product_id}`,
        { qty: newQty },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === product_id
              ? { ...product, stock_qty_frontend: product.stock_qty_frontend + newQty, stock_qty_backend: product.stock_qty_backend + newQty }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    console.log("Deleting product with ID:", productId);
    if (!productId) {
      console.error("Invalid product ID");
      return;
    }
    try {
      await axiosInstance.delete(`/product/${productId}`, {
        withCredentials: true,
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-grow-1 bg-light">
          <TopBar />
          <div className="min-vh-90 bg-light py-5">
            <div className="container-fluid">
              <div className="row justify-content-center text-center">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title fw-bold m-0 d-flex align-items-center">
                          <Package2 className="me-2" size={24} />
                          Recent Products
                        </h5>
                        <div>
                          <AddProductPopup onSubmit={handleProductSubmit} />
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-2">
                          <thead className="table-light">
                            <tr>
                              <th className="border-0">Product ID</th>
                              <th className="border-0">Name</th>
                              <th className="border-0">Category</th>
                              <th className="border-0">Price</th>
                              <th className="border-0">Stock หน้าบ้าน</th>
                              <th className="border-0">Stock หลังบ้าน</th>
                              <th className="border-0">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.length > 0 ? (
                              products.map((product, index) => (
                                <tr key={product.id || index}>
                                  <td className="fw-medium">
                                    #{product.id || index}
                                  </td>
                                  <td>{product.product_name}</td>
                                  <td>{product.typeid || "N/A"}</td>
                                  <td>${product.price_per_unit}</td>
                                  <td>{product.stock_qty_frontend}</td>
                                  <td>{product.stock_qty_backend}</td>
                                  <td>
                                    <button
                                      className="btn btn-outline-primary btn-sm me-2"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#addStockProductModal-${product.id}`}
                                    >
                                      Add Stock
                                    </button>
                                    <AddStockProductPopup
                                      product={product}
                                      onSubmit={handleAddStockProductUpdate}
                                      modalId={`addStockProductModal-${product.id}`}
                                    />

                                    <button
                                      className="btn btn-outline-primary btn-sm me-2"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#editProductModal-${product.id}`}
                                    >
                                      Edit
                                    </button>
                                    <EditProductPopup
                                      product={product}
                                      onSubmit={handleProductUpdate}
                                      modalId={`editProductModal-${product.id}`}
                                    />
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() =>
                                        product.id && handleDelete(product.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center">
                                  No products available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProduct;
