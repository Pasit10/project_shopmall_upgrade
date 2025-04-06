import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import Product from "../Types/Product";

const ProductDetail = () => {
  const { product_id } = useParams<{ product_id: string }>(); // ดึง product_id จาก URL
  const [product, setProduct] = useState<Product | null>(null); // ใช้ `null` แทน `[]`
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${product_id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setProduct(response.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchProduct();
  }, [setProduct, product_id]);

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await axiosInstance.post(
        "/user/cart",
        { id: product.id },
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      if (response.status === 200) {
        alert("Added to cart!");
      } else if (response.status === 401) {
        alert("You need to log in to add items to the cart.");
        navigate("/login");
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error adding to cart", error);
      alert("Something went wrong. Please check your connection.");
    }
  };

  // ถ้ายังโหลดข้อมูลไม่เสร็จ ให้แสดงข้อความ Loading
  if (!product)
    return (
      <div
        className="container d-flex align-items-center justify-content-center flex-grow-1"
        style={{ height: "80vh" }}
      >
        <p className="text-center">Loading...</p>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 ">{product.product_name}</h2>

      <div
        className="d-flex justify-content-between mt-5"
        style={{ minHeight: "90vh" }}
      >
        {/* คอลัมน์ซ้าย (รูปภาพ) */}
        <div className="col-md-6">
          <img
            src={product.product_image}
            alt={product.product_name}
            className="img-fluid rounded shadow-lg"
            style={{ width: "70vh", height: "80vh", objectFit:"cover"}}
          />
        </div>

        {/* คอลัมน์ขวา (รายละเอียดสินค้า) */}
        <div className="col-md-5">
          <p className="text-muted ">{product.detail}</p>
          <h4 className="fw-bold text-end mt-5">${product.price_per_unit}</h4>
          <div className="text-end">
            <button
              className="btn btn-primary mt-2"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
            >
              🛒 Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
