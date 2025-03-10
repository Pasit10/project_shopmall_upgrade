export default interface Product {
    id: number;
    product_name: string;
    price_per_unit: number;
    cost_per_unit: number;
    detail: string;
    stock_qty_frontend: number;
    stock_qty_backend: number;
    product_image: string;
    typeid: number;
  }