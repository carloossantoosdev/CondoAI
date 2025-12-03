import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  requiresPaid?: boolean;
}

interface SidebarNavProps {
  menuItems: MenuItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ menuItems, onNavigate }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <h1 className="text-xl font-bold !bg-gradient-to-r !from-[#ff6b2d] !to-[#b91c1c] bg-clip-text text-transparent">
          💰 Finanças Pro
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-5">
        <ul role="list" className="flex flex-col gap-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const isDisabled = item.requiresPaid && user?.subscriptionStatus !== 'paid';
            
            return (
              <li key={item.text}>
                <button
                  onClick={() => !isDisabled && handleNavigation(item.path)}
                  disabled={isDisabled}
                  className={cn(
                    'group flex w-full gap-x-3 rounded-lg p-3 text-sm font-semibold transition-all',
                    isActive
                      ? '!bg-gradient-to-r !from-[#ff6b2d] !to-[#b91c1c] text-white shadow-md'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-[#ff6b2d]',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className={cn(isActive && 'text-white')}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.text}</span>
                  {item.requiresPaid && user?.subscriptionStatus !== 'paid' && (
                    <Badge variant="warning" className="text-xs">PRO</Badge>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Separator */}
      <Separator />

      {/* User Section */}
      <div className="p-6">
        <div className="flex items-center gap-x-3 p-3 rounded-lg bg-slate-50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Usuário'} />
            <AvatarFallback className="!bg-gradient-to-br !from-[#ff6b2d] !to-[#b91c1c] text-white font-semibold">
              {user?.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.displayName || 'Usuário'}
            </p>
            <Badge 
              variant={user?.subscriptionStatus === 'paid' ? 'success' : 'secondary'}
              className="text-xs mt-1"
            >
              {user?.subscriptionStatus === 'paid' ? 'PRO' : 'Gratuito'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-slate-500 hover:text-[#ff6b2d]"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

