import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { storyApi } from '@/lib/api';

interface Story {
  id: number;
  title: {
    gasy?: string;
    fr?: string;
    en?: string;
  };
  synopsis: {
    gasy?: string;
    fr?: string;
    en?: string;
  };
  cover_image: string;
  author: {
    id: number;
    pseudo: string;
    avatar?: string;
  };
  genre: {
    title: string;
  };
  chapters_count: number;
  status: string;
}

export default function FeaturedStories() {
  const { t, language } = useLanguage();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      // Charger les histoires publiées
      const response = await storyApi.getPublicStories();
      // Limiter à 4 histoires
      setStories(response.data.data?.slice(0, 4) || []);
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.[language] || title?.gasy || title?.fr || title?.en || 'Sans titre';
  };

  const getSynopsis = (synopsis: any) => {
    if (typeof synopsis === 'string') return synopsis;
    return synopsis?.[language] || synopsis?.gasy || synopsis?.fr || synopsis?.en || '';
  };

  const gradients = [
    'from-amber-900/80 to-orange-950/80',
    'from-emerald-900/80 to-teal-950/80',
    'from-indigo-900/80 to-violet-950/80',
    'from-rose-900/80 to-red-950/80',
  ];

  return (
    <section id="stories" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6 text-foreground">
            {t('stories.title')}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            {t('stories.subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-2xl bg-secondary/50 animate-pulse"
              />
            ))
          ) : stories.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune histoire disponible pour le moment</p>
            </div>
          ) : (
            stories.map((story, index) => (
              <div
                key={story.id}
                className="group relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer bg-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Cover Image Background */}
                <div className="aspect-[3/4] relative">
                  {story.cover_image ? (
                    <img 
                      src={story.cover_image} 
                      alt={getTitle(story.title)}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
                      {/* Mystical pattern overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <pattern id={`pattern-${story.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1" fill="currentColor" />
                          </pattern>
                          <rect width="100%" height="100%" fill={`url(#pattern-${story.id})`} />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Genre badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/80 backdrop-blur-sm text-white">
                      {story.genre?.title || 'Sans genre'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#1DB954]">{t('stories.series')}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{story.chapters_count} {t('stories.episodes')}</span>
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2 text-foreground group-hover:text-[#1DB954] transition-colors">
                      {getTitle(story.title)}
                    </h3>
                    {story.author && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Par <span className="text-[#1DB954] font-medium">{story.author.pseudo}</span>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {getSynopsis(story.synopsis) || 'Découvrez cette histoire captivante'}
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold transition-colors"
                    >
                      {t('stories.listen')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
