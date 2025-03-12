import ProductCardProps from "../Types/ProductCardProps";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="col-md-4">
      <div className="card product-card h-100">
        <img
          src={product.product_image}
          className="card-img-top"
          alt={product.product_name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{product.product_name}</h5>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted text-decoration-line-through ms-2">
                ${product.price_per_unit}
              </small>
            </div>
            <button className="btn btn-primary btn-sm">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
