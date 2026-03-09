export interface StockAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: 'LowStock';
  message: string;
  date: string;
}