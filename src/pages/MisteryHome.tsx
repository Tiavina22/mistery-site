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
              {/* Left Content */}
              <div className="space-y-6">
                <Badge className="mb-2 bg-red-600/20 text-red-400 border-red-600/50">
                  {t('mistery.badge')}
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                  <span>Hey, nous sommes </span>
                  <span className="text-red-500">MISTERY</span>
                  <span className="inline-block ml-3">👋</span>
                </h1>

                <div className="space-y-4 text-base md:text-lg text-gray-400">
                  <p>
                    <strong className="text-white">Les créateurs malgaches n'avaient pas de maison de production dédiée</strong>. 
                    Des milliers de talents perdus – créateurs de mystères, traditions, drames réels de Madagascar.
                  </p>

                  <div className="pl-6 border-l-4 border-red-600 space-y-3 py-2">
                    <p className="text-white font-semibold text-lg">
                      MISTERY, c'est :
                    </p>

                    <div className="space-y-2">
                      <p>
                        <span className="text-red-500 mr-2">✓</span>
                        <strong className="text-white">Maison de production</strong> d'histoires vraies
                      </p>
                      <p>
                        <span className="text-red-500 mr-2">✓</span>
                        <strong className="text-white">Création de contenu</strong> malgache authentique
                      </p>
                      <p>
                        <span className="text-red-500 mr-2">✓</span>
                        <strong className="text-white">Distribution via APPISTERY</strong> la plateforme
                      </p>
                    </div>
                  </div>

                  <p>
                    Nous produisons les mystères authentiques de Madagascar.
                  </p>
                </div>
                
                <div className="flex gap-4 flex-wrap pt-4">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 rounded-full px-8 transition-all hover:scale-105"
                    onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    {t('mistery.watch')}
                  </Button>
                </div>
              </div>

              {/* Right: Video Thumbnails Collage */}
              <div className="relative h-[500px] hidden md:block">
                <>
                  {/* Large main image - top left */}
                  <div 
                    className="absolute top-0 left-0 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(-3deg)' }}
                  >
                    <img src="/illustrations/ody.png" alt="Story" className="w-full h-full object-cover" />
                  </div>

                  {/* Medium image - top right */}
                  <div 
                    className="absolute top-12 right-8 w-56 h-64 rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(5deg)' }}
                  >
                    <img src="/illustrations/ouija.png" alt="Story" className="w-full h-full object-cover" />
                  </div>

                  {/* Small image - middle left */}
                  <div 
                    className="absolute top-48 left-12 w-48 h-56 rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(2deg)' }}
                  >
                    <img src="/illustrations/rohy.png" alt="Story" className="w-full h-full object-cover" />
                  </div>

                  {/* Large image - bottom center */}
                  <div 
                    className="absolute bottom-12 left-32 w-72 h-72 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <img src="/illustrations/silampanahy.png" alt="Story" className="w-full h-full object-cover" />
                  </div>

                  {/* Medium image - bottom right */}
                  <div 
                    className="absolute bottom-20 right-0 w-52 h-60 rounded-xl overflow-hidden shadow-xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(4deg)' }}
                  >
                    <img src="/illustrations/stanley.png" alt="Story" className="w-full h-full object-cover" />
                  </div>

                  {/* Small image - middle right */}
                  <div 
                    className="absolute top-32 right-20 w-44 h-52 rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                    style={{ transform: 'rotate(-4deg)' }}
                  >
                    <img src="/illustrations/taxi.png" alt="Story" className="w-full h-full object-cover" />
                  </div>
                </>
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-black via-red-950/20 to-black border-y border-red-600/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Images Collage */}
              <div className="relative h-[500px] hidden md:block">
                {/* Image 1 - top left */}
                <div 
                  className="absolute top-0 left-0 w-56 h-64 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                  style={{ transform: 'rotate(-4deg)' }}
                >
                  <img src="/why/1.png" alt="MISTERY" className="w-full h-full object-cover" />
                </div>

                {/* Image 2 - top right */}
                <div 
                  className="absolute top-16 right-12 w-48 h-56 rounded-xl overflow-hidden shadow-xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  <img src="/why/2.png" alt="MISTERY" className="w-full h-full object-cover" />
                </div>

                {/* Image 3 - middle left */}
                <div 
                  className="absolute top-48 left-8 w-52 h-60 rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                  style={{ transform: 'rotate(2deg)' }}
                >
                  <img src="/why/3.png" alt="MISTERY" className="w-full h-full object-cover" />
                </div>

                {/* Image 4 - bottom center */}
                <div 
                  className="absolute bottom-8 left-28 w-64 h-72 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  <img src="/why/4.png" alt="MISTERY" className="w-full h-full object-cover" />
                </div>

                {/* Image 5 - bottom right */}
                <div 
                  className="absolute bottom-16 right-0 w-44 h-52 rounded-xl overflow-hidden shadow-xl bg-gray-900 border border-red-600/30 hover:scale-105 hover:z-30 transition-all duration-300"
                  style={{ transform: 'rotate(5deg)' }}
                >
                  <img src="/why/5.png" alt="MISTERY" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="text-center md:text-left">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                  {t('mistery.why.title')}
                </h2>
                <div className="space-y-6 text-lg md:text-xl text-gray-300">
                  <p className="leading-relaxed">
                    {t('mistery.why.question')}
                  </p>
                  <p className="leading-relaxed">
                    {t('mistery.why.answer1')}
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-red-500">MISTERY</strong> {t('mistery.why.answer2')} <strong className="text-red-500">APPISTERY</strong>.
                  </p>
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
