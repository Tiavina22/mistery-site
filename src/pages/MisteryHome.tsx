import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MisteryHeader from '@/components/MisteryHeader';
import MisteryFooter from '@/components/MisteryFooter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Sparkles, Shield, TrendingUp, Star, MessageCircle, Heart, Play, Loader2 } from 'lucide-react';

const MisteryHome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'MISTERY - Tantara Sombin-tantara Malagasy';
    loadLatestVideos();
  }, []);

  const loadLatestVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/all?limit=5&sort=recent`, {
        method: 'GET'
      });
      const data = await response.json();
      if (data.success && data.data) {
        setVideos(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <MisteryHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-black via-red-950/30 to-black border-b border-red-600/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-600/50">
                  {t('mistery.badge')}
                </Badge>
                <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                  {t('mistery.title')}
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
                  {t('mistery.subtitle')}
                </h2>
                <p className="text-lg text-gray-400 mb-4">
                  {t('mistery.description')}
                </p>
                <p className="text-base text-gray-400 mb-8">
                  {t('mistery.description.full')}
                </p>
                
                <div className="flex gap-4 flex-wrap">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                    onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    {t('mistery.watch')}
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold"
                    onClick={() => navigate('/creator/login')}
                  >
                    {t('mistery.signin')}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <div className="text-3xl font-bold text-red-500 mb-2">{t('mistery.stories')}</div>
                    <p className="text-sm text-gray-400">{t('mistery.stories.label')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500 mb-2">{t('mistery.creators')}</div>
                    <p className="text-sm text-gray-400">{t('mistery.creators.label')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500 mb-2">{t('mistery.viewers')}</div>
                    <p className="text-sm text-gray-400">{t('mistery.viewers.label')}</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="hidden md:flex justify-center">
                <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-red-900/40 to-black border border-red-600/30 flex items-center justify-center group cursor-pointer hover:border-red-500/50 transition-all">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎬</div>
                    <p className="text-gray-300 text-lg">Tantara Malgache</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-colors">
                      <Play className="w-8 h-8 fill-white text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Videos Section */}
        <section id="stories" className="py-20 px-4 md:px-6 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-2">{t('mistery.featured')}</h2>
              <p className="text-gray-400">{t('mistery.featured.desc')}</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : videos.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="bg-gray-900 border-gray-800 hover:border-red-600/50 transition-all hover:shadow-lg hover:shadow-red-600/20 cursor-pointer overflow-hidden group"
                    onClick={() => video.video_url && window.open(video.video_url, '_blank')}
                  >
                    <div className="h-40 bg-gradient-to-br from-red-900/60 to-black flex items-center justify-center relative overflow-hidden">
                      {video.thumbnail_image ? (
                        <img
                          src={video.thumbnail_image}
                          alt={typeof video.title === 'string' ? video.title : video.title?.fr || 'Vidéo'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="text-6xl">🎬</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-white text-sm">
                            {typeof video.title === 'string' ? video.title : video.title?.fr || video.title?.en || 'Sans titre'}
                          </CardTitle>
                          <CardDescription className="mt-2 text-gray-400 text-xs">
                            {video.author?.pseudo || 'Créateur'}
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-600 text-white text-xs">
                          {video.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span>{video.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{video.reaction_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{video.comment_count || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucune vidéo disponible pour le moment</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {t('mistery.explore')}
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 md:px-6 bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-12">
              {t('mistery.about.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.authentic')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.authentic.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.culture')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.culture.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.authors')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.authors.desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <Star className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.quality')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.quality.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.safe')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.safe.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 text-red-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('mistery.anytime')}</h3>
                    <p className="text-gray-400">
                      {t('mistery.anytime.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-4 md:px-6 bg-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-12 text-center">
              {t('mistery.why')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">{t('mistery.why.content')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {t('mistery.why.content.desc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">{t('mistery.why.everywhere')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {t('mistery.why.everywhere.desc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">{t('mistery.why.support')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {t('mistery.why.support.desc')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-t from-red-950/40 to-black border-t border-red-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-white mb-6">
              {t('mistery.discover')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('mistery.discover.desc')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 fill-white" />
                {t('mistery.now')}
              </Button>
              <Button 
                size="lg" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold"
                onClick={() => navigate('/creator/login')}
              >
                {t('mistery.signin')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <MisteryFooter />
    </div>
  );
};

export default MisteryHome;
