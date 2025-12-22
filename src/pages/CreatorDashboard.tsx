import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Eye, 
  Heart, 
  MessageCircle, 
  Users, 
  TrendingUp,
  LogOut,
  Settings,
  PlusCircle
} from 'lucide-react';

interface Stats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
}

export default function CreatorDashboard() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={author.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(author.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{author.email}</h1>
                <p className="text-sm text-muted-foreground">{author.speciality || 'Créateur'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/creator/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Histoires</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStories}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedStories} publiées, {stats.draftStories} brouillons
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vues</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total de lectures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">J'aime</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sur toutes vos histoires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Abonnés</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Suivent vos histoires</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="stories" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="stories">Mes histoires</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>

            <Button onClick={() => navigate('/creator/story/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nouvelle histoire
            </Button>
          </div>

          <TabsContent value="stories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vos histoires</CardTitle>
                <CardDescription>
                  Gérez et modifiez vos histoires publiées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune histoire</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez à partager vos histoires avec votre audience
                    </p>
                    <Button onClick={() => navigate('/creator/story/new')}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Créer votre première histoire
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Liste des histoires à implémenter */}
                    <p className="text-muted-foreground">Liste des histoires à venir...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyses de performance</CardTitle>
                <CardDescription>
                  Suivez l'évolution de vos histoires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Analyses détaillées à venir...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
