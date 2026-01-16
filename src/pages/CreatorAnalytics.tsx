import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi } from '@/lib/api';
import CreatorLayout from '@/components/CreatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Heart, BookOpen, MessageCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

interface Stats {
  total_stories: number;
  published_stories: number;
  draft_stories: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

interface Story {
  id: number;
  title: any;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  cover_image?: string;
}

export default function CreatorAnalytics() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, author } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/creator/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (isAuthenticated && author?.id) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, author?.id]);

  const loadAnalytics = async () => {
    if (!author?.id) return;
    
    try {
      setIsLoading(true);
      
      // Charger stats, stories et followers en parallèle
      const [statsRes, storiesRes, followersRes] = await Promise.all([
        authorApi.getStats(author.id),
        authorApi.getStories(author.id),
        fetch(`${API_BASE_URL}/api/authors/${author.id}/followers`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('author_token')}` }
        }).then(r => r.json())
      ]);

      setStats(statsRes.data.data);
      
      // Top 5 stories par vues
      const stories = storiesRes.data.data || [];
      const sorted = [...stories].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      setTopStories(sorted.slice(0, 5));
      
      if (followersRes.success) {
        setFollowersCount(followersRes.count || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoryTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.fr || title?.en || 'Sans titre';
  };

  if (isAuthLoading || isLoading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-[#1DB954]" />
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
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-10 h-10 text-[#1DB954]" />
              <div>
                <h1 className="text-5xl font-bold text-foreground">Statistiques</h1>
                <p className="text-muted-foreground text-lg">Analysez vos performances</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Vues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{(stats?.total_views || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{(stats?.total_likes || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Abonnés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{followersCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Commentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{(stats?.total_comments || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats détaillées */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Histoires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">{stats?.total_stories || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Publiées</span>
                    <span className="text-lg font-semibold text-green-500">{stats?.published_stories || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Brouillons</span>
                    <span className="text-lg font-semibold text-yellow-500">{stats?.draft_stories || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vues / Histoire</span>
                    <span className="text-lg font-semibold text-foreground">
                      {stats?.published_stories ? Math.round((stats.total_views || 0) / stats.published_stories) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Likes / Histoire</span>
                    <span className="text-lg font-semibold text-foreground">
                      {stats?.published_stories ? Math.round((stats.total_likes || 0) / stats.published_stories) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taux d'interaction</span>
                    <span className="text-lg font-semibold text-foreground">
                      {stats?.total_views ? ((stats.total_likes / stats.total_views) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="text-2xl font-bold text-purple-500">{followersCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vues totales</span>
                    <span className="text-lg font-semibold text-foreground">{(stats?.total_views || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Commentaires</span>
                    <span className="text-lg font-semibold text-foreground">{(stats?.total_comments || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-none">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1DB954]" />
                  Performance Globale
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vue d'ensemble de vos statistiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Vues</span>
                      <span className="text-sm font-semibold text-foreground">{(stats?.total_views || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, (stats?.total_views || 0) / 10)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Likes</span>
                      <span className="text-sm font-semibold text-foreground">{(stats?.total_likes || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, (stats?.total_likes || 0) / 5)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Commentaires</span>
                      <span className="text-sm font-semibold text-foreground">{(stats?.total_comments || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, (stats?.total_comments || 0) / 3)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Followers</span>
                      <span className="text-sm font-semibold text-foreground">{followersCount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, followersCount / 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1DB954]" />
                  Top 5 Histoires
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Les plus populaires par vues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topStories.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Aucune histoire disponible</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topStories.map((story, index) => (
                      <div key={story.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        {story.cover_image && (
                          <img src={story.cover_image} alt={getStoryTitle(story.title)} className="w-12 h-16 object-cover rounded shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">{getStoryTitle(story.title)}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {story.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {story.reaction_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {story.comment_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
