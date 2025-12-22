import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Eye, 
  Heart, 
  MessageCircle, 
  Users, 
  TrendingUp,
  LogOut,
  Settings,
  PlusCircle,
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/creator/dashboard' },
  { icon: FileText, label: 'Mes histoires', path: '/creator/stories' },
  { icon: BarChart3, label: 'Statistiques', path: '/creator/analytics' },
  { icon: Bell, label: 'Notifications', path: '/creator/notifications' },
  { icon: Settings, label: 'Paramètres', path: '/creator/settings' },
];

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { author, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    followers: 0,
  });
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    if (!author) return;

    try {
      setIsLoading(true);
      const [statsRes, storiesRes] = await Promise.all([
        authorApi.getStats(author.id),
        authorApi.getStories(author.id),
      ]);

      setStats(statsRes.data.data);
      setStories(storiesRes.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!author) return null;

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden lg:flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-primary-foreground text-lg">A</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              APPISTERY
            </span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Espace Créateur</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(author.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{author.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {author.speciality || 'Créateur'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Tableau de bord</h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenue dans votre espace créateur
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Retour au site
                </Button>
                <Button onClick={() => navigate('/creator/story/new')}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouvelle histoire
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Histoires totales
                </CardTitle>
                <BookOpen className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalStories}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.publishedStories} publiées · {stats.draftStories} brouillons
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vues totales
                </CardTitle>
                <Eye className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lectures de vos histoires
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Réactions
                </CardTitle>
                <Heart className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  J'aime et réactions
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Abonnés
                </CardTitle>
                <Users className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.followers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Suivent votre profil
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Stories */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vos histoires récentes</CardTitle>
                  <CardDescription>
                    Gérez et modifiez vos histoires publiées
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/creator/stories')}>
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : stories.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune histoire</h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez à partager vos histoires avec votre audience
                  </p>
                  <Button onClick={() => navigate('/creator/story/new')}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Créer votre première histoire
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stories.slice(0, 5).map((story: any) => (
                    <div 
                      key={story.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{story.title?.fr || 'Sans titre'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {story.genre?.title || 'Sans genre'} · {story.chapters_count || 0} chapitres
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            story.status === 'published' 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}>
                            {story.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendances
                </CardTitle>
                <CardDescription>
                  Performance de vos histoires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Graphiques de tendances à venir
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Commentaires récents
                </CardTitle>
                <CardDescription>
                  Derniers retours de vos lecteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Aucun commentaire récent
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
