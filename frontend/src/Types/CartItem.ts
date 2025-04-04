export default interface CartItem {
  id: number;
  qty: number;
  product_name: string;
  price_per_unit: number;
  is_select: string;
  stock_qty_frontend: number;
}