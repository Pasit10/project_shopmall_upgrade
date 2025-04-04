import Product from "./Product";

export default interface ProductListProps {
    products: Product[];
    handleAddToCart: (product: Product) => Promise<void>;
  }