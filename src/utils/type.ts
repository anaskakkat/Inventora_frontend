export interface Sale {
  receiptNumber?: string;
  customerId: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    total: number;
  }[];
  totalAmount: number;
}

export interface InventoryItem {
  _id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  _id: string;
  name: string;
}
