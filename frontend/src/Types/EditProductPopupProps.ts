import Product from "./Product";

export default interface EditProductPopupProps {
  product: Product;
  onSubmit: (product: Product) => Promise<void>;
  modalId: string;
}