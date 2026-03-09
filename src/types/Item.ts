export type ItemCategory = 'Electronics' | 'Furniture' | 'Stationery' | 'Office Supplies' | 'Other';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  reorderLevel: number;
  lastUpdated: string;
}