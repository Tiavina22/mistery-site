import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateStoryDialog from '@/components/CreateStoryDialog';
import CreatorLayout from '@/components/CreatorLayout';
import { 
  BookOpen, 
  Eye, 
  Heart, 
  Users, 
  TrendingUp,
  Plus,
  FileText,
  Clock,
  ArrowRight,
  Sparkles
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

interface Story {
  id: number;
  title: any;
  status: string;
  cover_image: string;
  genre: { title: string };
  chapters_count: number;
  reaction_count: number;
  view_count: number;
  created_at: string;
}

export default function CreatorDashboardNew() {
  const navigate = useNavigate();
  const { author, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [stats, setStats] = useState<Stats>({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    followers: 0,
  });
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isAuthLoading, navigate]);

  const loadDashboardData = async () => {
    if (!author) return;

    try {
      setIsLoading(true);
      const [statsRes, storiesRes] = await Promise.all([
        authorApi.getStats(author.id),
        authorApi.getStories(author.id),
      ]);

      setStats(statsRes.data.data);
      setStories(storiesRes.data.data.slice(0, 5)); // 5 dernières histoires
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoryTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.fr || title?.en || 'Sans titre';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Publié</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  if (!author) return null;

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto">
        {/* Header - Style Spotify */}
        <div className="px-8 py-6 bg-gradient-to-b from-gray-800 to-transparent">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 text-white">
                Bonjour
              </h1>
              <p className="text-gray-400 text-lg">
                {author.email.split('@')[0]}
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 h-12 rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle histoire
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalStories}</p>
                  <p className="text-sm text-gray-400">Histoires</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Vues</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalLikes.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Likes</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Abonnés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          <Card className="bg-[#181818] border-none">
            <CardHeader>
              <CardTitle className="text-white">Histoires récentes</CardTitle>
              <CardDescription className="text-gray-400">Vos dernières créations</CardDescription>
            </CardHeader>
            <CardContent>
              {stories.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Aucune histoire</h3>
                  <p className="text-gray-400 mb-6">
                    Commencez par créer votre première histoire
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une histoire
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
                      onClick={() => navigate(`/creator/stories/${story.id}/chapters`)}
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {story.cover_image ? (
                          <img
                            src={story.cover_image}
                            alt={getStoryTitle(story.title)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <BookOpen className="w-6 h-6 text-primary/40" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate text-white group-hover:text-[#1DB954] transition-colors">
                            {getStoryTitle(story.title)}
                          </h3>
                          {getStatusBadge(story.status)}
                        </div>
                        <p className="text-sm text-gray-400">
                          {story.genre?.title} · {story.chapters_count} chapitre{story.chapters_count > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{story.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{story.reaction_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#181818] border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Performance
                </CardTitle>
                <CardDescription className="text-gray-400">Vos tendances cette semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <p>Graphiques à venir</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#181818] border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Activité récente
                </CardTitle>
                <CardDescription className="text-gray-400">Dernières actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <p>Activités à venir</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateStoryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          loadDashboardData();
        }}
      />
    </CreatorLayout>
  );
}
