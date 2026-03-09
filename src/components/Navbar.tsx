import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { UserBadge } from './UserBadge';
import { getCurrentUser } from '../utils/auth';

interface NavbarProps {
  onMenuToggle: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Navbar({ onMenuToggle, isDark, onThemeToggle }: NavbarProps) {
  const user = getCurrentUser();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden text-slate-600 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Inventory Management
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {user?.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && <UserBadge role={user.role} />}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}