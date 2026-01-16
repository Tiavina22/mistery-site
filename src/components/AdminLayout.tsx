import { ReactNode } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/NotificationBell';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Shield, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Wallet,
  Bell,
  Smartphone,
  PackageCheck,
  Crown,
  CreditCard,
  Banknote,
  BookCheck
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, hasPermission } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!admin) {
    navigate('/admin/login');
    return null;
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
      permission: null
    },
    {
      icon: Users,
      label: 'Utilisateurs',
      path: '/admin/users',
      permission: 'VIEW_USERS'
    },
    {
      icon: UserCheck,
      label: 'Créateurs',
      path: '/admin/authors',
      permission: 'VIEW_AUTHORS'
    },
    {
      icon: Shield,
      label: 'Validation KYC',
      path: '/admin/kyc',
      permission: 'VIEW_KYC'
    },
    {
      icon: BookCheck,
      label: 'Validation Contenu',
      path: '/admin/content-approval',
      permission: 'MODERATE_CONTENT'
    },
    {
      icon: Wallet,
      label: 'Moyens de paiement',
      path: '/admin/payment-methods',
      permission: 'VIEW_PAYMENTS'
    },
    {
      icon: Crown,
      label: 'Offres Premium',
      path: '/admin/subscription-offers',
      permission: null
    },
    {
      icon: CreditCard,
      label: 'Souscriptions',
      path: '/admin/subscriptions',
      permission: null
    },
    {
      icon: Banknote,
      label: 'Paiements',
      path: '/admin/payments',
      permission: null
    },
    {
      icon: Wallet,
      label: 'Demandes de retrait',
      path: '/admin/withdrawals',
      permission: 'VIEW_PAYMENTS'
    },
    {
      icon: Smartphone,
      label: 'Providers Mobile Money',
      path: '/admin/mobile-money-providers',
      permission: 'VIEW_PROVIDERS'
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/admin/notifications',
      permission: null
    },
    {
      icon: PackageCheck,
      label: 'Versions App',
      path: '/admin/app-versions',
      permission: null
    },
    {
      icon: Settings,
      label: 'Paramètres',
      path: '/admin/settings',
      permission: null
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <NotificationBell isAdmin={true} className="w-full text-muted-foreground hover:text-foreground" />
          
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isSidebarOpen && <span className="ml-3">Thème</span>}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Déconnexion</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {admin.prenom} {admin.nom}
              </p>
              <p className="text-xs text-muted-foreground">{admin.email}</p>
            </div>
            {admin.avatar ? (
              <img src={admin.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {admin.prenom?.[0]}{admin.nom?.[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
