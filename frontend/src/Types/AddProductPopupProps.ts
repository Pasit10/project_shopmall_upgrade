import Product from "./Product";

export default interface AddProductPopupProps {
    onSubmit: (product: Product) => void;
  }