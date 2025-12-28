import { ReactNode } from 'react';
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
  Home
} from 'lucide-react';

interface CreatorLayoutProps {
  children: ReactNode;
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { author, logout } = useAuth();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/creator/dashboard' },
    { icon: FileText, label: 'Mes Histoires', path: '/creator/stories' },
    { icon: Tag, label: 'Genres', path: '/creator/genres' },
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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Style Spotify */}
      <aside className="w-64 bg-black flex flex-col p-6 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">
              APPISTERY
            </h1>
            <p className="text-xs text-gray-400">Creator Studio</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-900 h-12">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Retour au site</span>
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-gray-900">
            <Avatar className="w-9 h-9">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback className="bg-green-500 text-black font-bold text-sm">
                {author && getInitials(author.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-white">{author?.email.split('@')[0]}</p>
              <p className="text-xs text-gray-400">Creator</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-900 h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Main Content - Style Spotify */}
      <main className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-black">
        {children}
      </main>
    </div>
  );
}
