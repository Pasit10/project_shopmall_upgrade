import Product from "./Product";

export default interface AddStockProductPopupProps {
  product: Product;
  onSubmit: (product: Product) => Promise<void>;
  modalId: string;
}