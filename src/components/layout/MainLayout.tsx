'use client';

import { useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  CreditCard,
  Mail,
  Menu,
  LogOut,
  X,
  User,
  Lightbulb,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  requiresPaid?: boolean;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
  { text: 'Perfil', icon: <User className="w-5 h-5" />, path: '/perfil' },
  { text: 'Investimentos', icon: <TrendingUp className="w-5 h-5" />, path: '/investimentos' },
  // { text: 'Dividendos', icon: <DollarSign className="w-5 h-5" />, path: '/dividendos' }, // Removido - será substituído por "Rendimentos"
  { text: 'Notícias', icon: <Newspaper className="w-5 h-5" />, path: '/noticias' },
  { text: 'Dicas', icon: <Lightbulb className="w-5 h-5" />, path: '/dicas' },
  { text: 'Planos', icon: <CreditCard className="w-5 h-5" />, path: '/planos' },
  { text: 'Contato', icon: <Mail className="w-5 h-5" />, path: '/contato' },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b border-slate-100">
            <h1 className="text-xl font-bold !bg-gradient-to-r !from-[#ff6b2d] !to-[#b91c1c] bg-clip-text text-transparent">
              💰 Finanças Pro
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
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
              
              {/* User Section at Bottom */}
              <li className="mt-auto pt-4 border-t border-slate-200">
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
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 z-50 flex w-64 flex-col lg:hidden">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100">
                <h1 className="text-xl font-bold !bg-gradient-to-r !from-[#ff6b2d] !to-[#b91c1c] bg-clip-text text-transparent">
                  💰 Finanças Pro
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
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
                  
                  <li className="mt-auto pt-4 border-t border-slate-200">
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
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar Mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-900">
              {menuItems.find(item => item.path === pathname)?.text || 'Finanças Pro'}
            </h2>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
