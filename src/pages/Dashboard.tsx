import { useEffect, useState } from 'react';
import { Package, AlertTriangle, Users, Layers, Clock } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Item } from '../types/Item';
import { StockAlert } from '../types/StockAlert';
import { getUsers } from '../utils/auth';

export function Dashboard() {
  const [items] = useLocalStorage<Item[]>('inventory-items', []);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.reorderLevel
    );
    
    const newAlerts: StockAlert[] = lowStockItems.map((item) => ({
      id: `ALT-${Date.now()}-${item.id}`,
      itemId: item.id,
      itemName: item.name,
      type: 'LowStock',
      message: `${item.name} is running low (${item.quantity} left)`,
      date: new Date().toISOString(),
    }));
    
    setAlerts(newAlerts);
  }, [items]);

  const users = getUsers();
  const activeUsers = users.filter((u) => u.status === 'ACTIVE');
  const categories = [...new Set(items.map((i) => i.category))];
  const lastUpdated = items.length > 0
    ? new Date(Math.max(...items.map((i) => new Date(i.lastUpdated).getTime()))).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Items"
          value={items.length}
          icon={Package}
          color="blue"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={alerts.length}
          icon={AlertTriangle}
          color="red"
          trend={alerts.length > 0 ? 'Items need attention' : 'All good'}
        />
        <DashboardCard
          title="Active Users"
          value={activeUsers.length}
          icon={Users}
          color="green"
        />
        <DashboardCard
          title="Categories"
          value={categories.length}
          icon={Layers}
          color="purple"
        />
        <DashboardCard
          title="Last Updated"
          value={lastUpdated}
          icon={Clock}
          color="amber"
        />
      </div>

      {alerts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Low Stock Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-900 dark:text-red-300">{alert.itemName}</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && items.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            No low stock alerts. Your inventory is in good shape.
          </p>
        </div>
      )}
    </div>
  );
}