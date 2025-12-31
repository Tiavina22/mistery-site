import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

interface NotificationBellProps {
  isAdmin?: boolean;
  className?: string;
}

export default function NotificationBell({ isAdmin = false, className = '' }: NotificationBellProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = isAdmin 
        ? localStorage.getItem('admin_token')
        : localStorage.getItem('author_token');
      
      if (!token) return;

      const endpoint = isAdmin ? '/api/admin/notifications' : '/api/authors/notifications/list';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success && data.data) {
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isAdmin) {
      navigate('/admin/notifications');
    } else {
      navigate('/creator/notifications');
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className={`relative ${className}`}
      title="Notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
