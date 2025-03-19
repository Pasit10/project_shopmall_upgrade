import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import Product from "../Types/Product";

const ProductDetail = () => {
  const { product_id } = useParams<{ product_id: string }>(); // ดึง product_id จาก URL
  const [product, setProduct] = useState<Product | null>(null); // ใช้ `null` แทน `[]`

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${product_id}`, { withCredentials: true });
        if (response.status === 200) {
          setProduct(response.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchProduct();
  }, [setProduct, product_id]);

  // ถ้ายังโหลดข้อมูลไม่เสร็จ ให้แสดงข้อความ Loading
  if (!product) return <p className="text-center">Loading...</p>;

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">{product.product_name}</h2>
      <div className="row">
        <div className="col-md-6">
          <img src={product.product_image} alt={product.product_name} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <p className="text-muted">{product.detail}</p>
          <h4 className="fw-bold">${product.price_per_unit}</h4>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
