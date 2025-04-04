import { Link } from "react-router-dom";
import ProductListProps from "../Types/ProductListProps";

const ProductList = ({ products, handleAddToCart }: ProductListProps) => {
  return (
    <div className="row">
      {products.map((product) => (
        <div key={product.id} className="col-md-6 col-lg-4 mb-4">
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
  );
};

export default ProductList;
