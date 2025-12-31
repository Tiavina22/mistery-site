import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Tag,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react';

interface CreatorLayoutProps {
  children: ReactNode;
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { author, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/creator/dashboard' },
    { icon: FileText, label: 'Mes Histoires', path: '/creator/stories' },
    { icon: BarChart3, label: 'Statistiques', path: '/creator/analytics' },
    { icon: Bell, label: 'Notifications', path: '/creator/notifications' },
    { icon: Settings, label: 'Paramètres', path: '/creator/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <h1 className="font-bold text-lg text-foreground">APPISTERY</h1>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-foreground"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Style Spotify */}
      <aside className={cn(
        "w-64 bg-background flex flex-col p-6 gap-6 transition-transform duration-300",
        "lg:translate-x-0 fixed lg:static h-screen z-50",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo - Desktop only */}
        <Link to="/" className="hidden lg:flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground">
              APPISTERY
            </h1>
            <p className="text-xs text-muted-foreground">Creator Studio</p>
          </div>
        </Link>

        {/* Mobile - Add spacing for close button */}
        <div className="lg:hidden h-12" />

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-12">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Retour au site</span>
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-secondary">
            <Avatar className="w-9 h-9">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback className="bg-green-500 text-black font-bold text-sm">
                {author && getInitials(author.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-foreground">{author?.email.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground">Creator</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Main Content - Style Spotify */}
      <main className="flex-1 overflow-auto bg-gradient-to-b from-secondary to-background lg:ml-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
