import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table } from '../components/Table';
import { FormModal, FormField } from '../components/FormModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Item, ItemCategory } from '../types/Item';

const ITEM_FIELDS: FormField[] = [
  { name: 'name', label: 'Item Name', type: 'text', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: [
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Furniture', label: 'Furniture' },
      { value: 'Stationery', label: 'Stationery' },
      { value: 'Office Supplies', label: 'Office Supplies' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { name: 'quantity', label: 'Quantity', type: 'number', required: true },
  { name: 'reorderLevel', label: 'Reorder Level', type: 'number', required: true },
];

export function Items() {
  const [items, setItems] = useLocalStorage<Item[]>('inventory-items', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const generateId = () => {
    const maxId = items.reduce((max, item) => {
      const num = parseInt(item.id.replace('INV', ''), 10);
      return num > max ? num : max;
    }, 0);
    return `INV${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setItems(items.filter((i) => i.id !== item.id));
    }
  };

  const handleSubmit = (data: any) => {
    const now = new Date().toISOString();
    
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...data, id: item.id, lastUpdated: now }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          ...data,
          id: generateId(),
          lastUpdated: now,
        },
      ]);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value: number, row: Item) => (
        <span
          className={`font-medium ${
            value <= row.reorderLevel ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'reorderLevel', label: 'Reorder Level' },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Items</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your inventory items</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Table
        columns={columns}
        data={items}
        searchPlaceholder="Search items..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        fields={ITEM_FIELDS}
        initialData={editingItem}
      />
    </div>
  );
}