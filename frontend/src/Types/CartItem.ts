export default interface CartItem {
    product_id: number;
    qty: number;
    product_name: string;
    price_per_unit: number;
    is_select: boolean;
  }