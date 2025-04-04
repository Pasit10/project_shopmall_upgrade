// import { useState } from "react";
import axiosInstance from "../utils/axios";
import Product from "../Types/Product";
import { Link, useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  // state สำหรับเก็บข้อมูลตะกร้า
  // const [cart, setCart] = useState<{ [productId: number]: number }>({});
  const navigate = useNavigate();

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await axiosInstance.post(
        "/user/cart",
        { id: product.id },
        {
          withCredentials: true,
          validateStatus: (status) => status < 500 // ให้ถือว่า 4xx เป็น error
        }
      );
      if (response.status === 200) {
        alert("Added to cart!");
      } else if (response.status === 401) {
        alert("You need to log in to add items to the cart.");
        navigate("/login")
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error adding to cart", error);
      alert("Something went wrong. Please check your connection.");
    }
  };

  const products: Product[] = [
    {
      id: 1,
      product_name: "Comfort Lounge Chair",
      price_per_unit: 1299,
      cost_per_unit: 800,
      detail: "Ergonomic design with premium leather upholstery",
      stock_qty_frontend: 10,
      stock_qty_backend: 100,
      product_image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
      typeid: 1,
    },
    {
      id: 2,
      product_name: "Minimalist Coffee Table",
      price_per_unit: 899,
      cost_per_unit: 500,
      detail: "Solid oak with tempered glass top",
      stock_qty_frontend: 5,
      stock_qty_backend: 50,
      product_image:
        "https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
      typeid: 2,
    },
    {
      id: 3,
      product_name: "Scandinavian Sofa",
      price_per_unit: 2499,
      cost_per_unit: 1500,
      detail: "Three-seater with washable linen cover",
      stock_qty_frontend: 8,
      stock_qty_backend: 80,
      product_image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      typeid: 3,
    },
    {
      id: 4,
      product_name: "Designer Dining Set",
      price_per_unit: 3299,
      cost_per_unit: 2000,
      detail: "Table with six matching chairs",
      stock_qty_frontend: 3,
      stock_qty_backend: 30,
      product_image:
        "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      typeid: 4,
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-2">Featured Products</h2>
      <p className="text-center text-muted mb-5">
        Our most popular pieces, handpicked for quality and design
      </p>

      <div className="row">
      {products.map((product) => (
        <div key={product.id} className="col-md-6 col-lg-3 mb-4">
          <Link
            to={`/product/${product.id}`}
            className="text-decoration-none text-dark"
          >
            <div className="card border-0 product-card h-100 d-flex flex-column">
              <div className="product-image-container">
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="card-img-top product-image"
                />
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title h6 fw-bold">
                    {product.product_name}
                  </h5>
                  <span className="fw-bold">${product.price_per_unit}</span>
                </div>
                <p className="card-text text-muted small mb-3">
                  {product.detail}
                </p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={(e) => {
                      e.preventDefault(); // ป้องกัน Link ทำงานเมื่อกดปุ่ม
                      handleAddToCart(product);
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
