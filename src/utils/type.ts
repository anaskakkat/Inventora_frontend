export interface Sale {
  customerId: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    total: number;
  }[];
  total: number;
}

export interface InventoryItem {
  _id: number;
  name: string;
  price: number;
}

export interface Customer {
  _id: string;
  name: string;
}
