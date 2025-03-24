export interface PurchaseHistory {
    id: string;
    productName: string;
    price: number;
    purchaseDate: string;
    image: string;
    status: 'delivered' | 'shipping' | 'processing';
  }