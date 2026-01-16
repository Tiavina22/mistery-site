import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreatorLayout from '@/components/CreatorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, X, Check, AlertCircle, CheckCircle2, XCircle, Clock, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

const notificationTypeIcons: { [key: string]: React.ReactNode } = {
  'welcome': <CheckCircle2 className="w-6 h-6 text-green-500" />,
  'kyc_pending': <AlertCircle className="w-6 h-6 text-yellow-500" />,
  'kyc_approved': <CheckCircle2 className="w-6 h-6 text-green-500" />,
  'kyc_rejected': <XCircle className="w-6 h-6 text-red-500" />,
  'payment_pending': <AlertCircle className="w-6 h-6 text-yellow-500" />,
  'payment_approved': <CheckCircle2 className="w-6 h-6 text-green-500" />,
  'payment_rejected': <XCircle className="w-6 h-6 text-red-500" />,
  'story_pending': <Clock className="w-6 h-6 text-yellow-500" />,
  'story_approved': <BookOpen className="w-6 h-6 text-green-500" />,
  'story_rejected': <BookOpen className="w-6 h-6 text-red-500" />,
  'chapter_pending': <Clock className="w-6 h-6 text-yellow-500" />,
  'chapter_approved': <FileText className="w-6 h-6 text-green-500" />,
  'chapter_rejected': <FileText className="w-6 h-6 text-red-500" />,
};

const notificationTypeColors: { [key: string]: string } = {
  'welcome': 'bg-green-500/20',
  'kyc_pending': 'bg-yellow-500/20',
  'kyc_approved': 'bg-green-500/20',
  'kyc_rejected': 'bg-red-500/20',
  'payment_pending': 'bg-yellow-500/20',
  'payment_approved': 'bg-green-500/20',
  'payment_rejected': 'bg-red-500/20',
  'story_pending': 'bg-yellow-500/20',
  'story_approved': 'bg-green-500/20',
  'story_rejected': 'bg-red-500/20',
  'chapter_pending': 'bg-yellow-500/20',
  'chapter_approved': 'bg-green-500/20',
  'chapter_rejected': 'bg-red-500/20',
};

export default function CreatorNotifications() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, author } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/creator/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && author?.id) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, author]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('author_token');
      
      const response = await fetch(`${API_BASE_URL}/api/authors/notifications/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications');
      }

      const data = await response.json();
      console.log('Réponse notifications:', data);
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      } else {
        console.log('Erreur data.success est false');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('author_token');
      
      const response = await fetch(`${API_BASE_URL}/api/authors/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('author_token');
      
      const response = await fetch(`${API_BASE_URL}/api/authors/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('author_token');
      
      const response = await fetch(`${API_BASE_URL}/api/authors/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Gérer différents formats de date
      let date: Date;
      
      // Si c'est un timestamp en millisecondes ou secondes
      if (!isNaN(Number(dateString))) {
        const num = Number(dateString);
        date = new Date(num > 10000000000 ? num : num * 1000);
      } else {
        // Gérer le format PostgreSQL avec timezone offset (ex: "2025-12-31 12:01:11.151+03")
        // Remplacer l'espace par T et le timezone offset par Z pour ISO format
        let isoString = dateString
          .replace(' ', 'T')
          .replace(/([+-]\d{2})$/, 'Z');
        
        date = new Date(isoString);
      }
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      if (diff < 60000) return 'À l\'instant';
      if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}m`;
      if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
      if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)}j`;
      
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bell className="h-12 w-12 animate-pulse mx-auto mb-4 text-[#1DB954]" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-secondary to-background border-b border-border">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Bell className="w-10 h-10 text-[#1DB954]" />
                <div>
                  <h1 className="text-5xl font-bold text-foreground">Notifications</h1>
                  <p className="text-muted-foreground text-lg">
                    {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle notification'}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Marquer tout comme lu
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {error && (
              <Card className="bg-red-500/10 border-red-500/20 mb-6">
                <CardContent className="py-4">
                  <p className="text-red-500 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="bg-card border-none animate-pulse">
                    <CardContent className="py-4">
                      <div className="h-20 bg-secondary rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <Card className="bg-card border-none">
                <CardContent className="py-16">
                  <div className="text-center">
                    <Bell className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Aucune notification</h3>
                    <p className="text-muted-foreground text-lg">
                      Vous n'avez pas encore de notifications
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                      notification.is_read 
                        ? 'bg-card hover:bg-secondary' 
                        : 'bg-secondary/50 hover:bg-secondary border-l-4 border-[#1DB954]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notificationTypeColors[notification.type] || 'bg-blue-500/20'
                    }`}>
                      {notificationTypeIcons[notification.type] || <Bell className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-semibold mb-1 ${
                            notification.is_read ? 'text-foreground' : 'text-foreground font-bold'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-muted-foreground text-sm mb-2 break-words">
                            {notification.message}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.is_read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Marquer comme lu"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
