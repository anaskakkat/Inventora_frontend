import jsPDF from "jspdf";

export interface Sale {
  receiptNumber?: string;
  customerId: {
    _id?: string;
    name: string;
  };
  date: string;
  items: {
    _id?: string;
    name: string;
    quantity: number;
    price?: number;
    total: number;
  }[];
  totalAmount: number;
}

export interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  unit?: string;
  quantity: number;
}

export interface Customer {
  _id: string;
  name: string;
}

// Define interfaces for data structure
export interface ReportData {
  totalPages?: number;
  headers: string[];
  rows: (string | number)[][];
}
export interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number; // Last stock quantity
}

export interface EmailTemplateParams {
  to_email: string;
  subject: string;
  message: string;
  attachment: string;
  attachment_name: string;
  [key: string]: string; // Add index signature to make it compatible with Record<string, unknown>
}

export interface AutoTableOptions {
  head: string[][];
  body: (string | number)[][];
  startY: number;
  styles?: {
    fontSize: number;
    cellPadding: number;
  };
  headStyles?: {
    fillColor: number[];
  };
}
export interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: AutoTableOptions) => JsPDFWithAutoTable;
}

// frontend/src/types/dashboard.ts
export interface DashboardData {
  stats: {
    totalItems: number;
    totalCustomers: number;
    totalSales: number;
  };
  earnings: Array<{
    date: string;
    amount: number;
  }>;
  newCustomers: Array<{
    _id: string;
    name: string;
    mobile: string;
    createdAt: string;
  }>;
  newItems: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    createdAt: string;
  }>;
}

export interface EarningsGraphProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance?: number;
}
