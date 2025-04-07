// Interface for the transaction detail item
interface TransactionDetail {
  idtransaction: number;
  seq: number;
  price_novat: number;
  vat: number;
  qty: number;
  idproduct: number;
}

// Interface for the main transaction
interface Transaction {
  idtransaction: number;
  totalprice: number;
  timestamp: string;
  vat: number;
  uid: string;
  idstatus: number;
  transaction_details: TransactionDetail[];
}

export type { Transaction, TransactionDetail };