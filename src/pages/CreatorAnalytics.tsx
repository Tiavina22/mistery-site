import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreatorLayout from '@/components/CreatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Heart, BookOpen } from 'lucide-react';

export default function CreatorAnalytics() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/creator/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
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
                    <p className="text-3xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Cette semaine</p>
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
                    <p className="text-3xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Cette semaine</p>
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
                    <p className="text-3xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Histoires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Publiées</p>
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
                  Performance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Évolution sur les 7 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Graphiques à venir</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1DB954]" />
                  Top Histoires
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Les plus populaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
