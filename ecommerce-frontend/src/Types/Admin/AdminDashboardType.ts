export interface TopSellingItem {
  item: string;
  itemDescription: string;
  unitPrice: number;
  ecomUnitPrice: number;
  quantityOrdered: number;
}

export interface OrderCountByHour {
  [date: string]: number;
}

export interface RecentTransaction {
  transactionId: string;
  amount: number;
  date: string;
  status: string;
}
export type TopSellingResponse = TopSellingItem[];
export type OrderCountByHourResponse = OrderCountByHour;
export type RecentTransactionsResponse = RecentTransaction[];
