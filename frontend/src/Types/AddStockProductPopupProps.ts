import Product from "./Product";

export default interface AddStockProductPopupProps {
  product: Product;
  onSubmit: (product_id: number, newQty: number) => Promise<void>;
  modalId: string;
}