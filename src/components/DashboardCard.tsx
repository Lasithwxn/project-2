import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorStyles = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

export function DashboardCard({ title, value, icon: Icon, trend, color = 'blue' }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{trend}</p>
            )}
          </div>
          <div className={`${colorStyles[color]} p-3 rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}