import ProductCard from "./ProductCard";
import ProductListProps from "../Types/ProductListProps";


const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="row g-4">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <p className="text-center">No products found for this category.</p>
      )}
    </div>
  );
};

export default ProductList;
