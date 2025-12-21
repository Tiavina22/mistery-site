import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const stories = [
  {
    id: 1,
    titleKey: 'story1.title',
    descKey: 'story1.desc',
    genreKey: 'genre.mystery',
    episodes: 12,
    gradient: 'from-amber-900/80 to-orange-950/80',
  },
  {
    id: 2,
    titleKey: 'story2.title',
    descKey: 'story2.desc',
    genreKey: 'genre.witchcraft',
    episodes: 8,
    gradient: 'from-emerald-900/80 to-teal-950/80',
  },
  {
    id: 3,
    titleKey: 'story3.title',
    descKey: 'story3.desc',
    genreKey: 'genre.paranormal',
    episodes: 15,
    gradient: 'from-indigo-900/80 to-violet-950/80',
  },
  {
    id: 4,
    titleKey: 'story4.title',
    descKey: 'story4.desc',
    genreKey: 'genre.horror',
    episodes: 10,
    gradient: 'from-rose-900/80 to-red-950/80',
  },
];

export default function FeaturedStories() {
  const { t } = useLanguage();

  return (
    <section id="stories" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6">
            {t('stories.title')}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            {t('stories.subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group relative rounded-2xl overflow-hidden hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover Image Background */}
              <div className={`aspect-[3/4] bg-gradient-to-br ${story.gradient} relative`}>
                {/* Mystical pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id={`pattern-${story.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pattern-${story.id})`} />
                  </svg>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Genre badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                    {t(story.genreKey)}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary">{t('stories.series')}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{story.episodes} {t('stories.episodes')}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                    {t(story.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {t(story.descKey)}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full group/btn gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    {t('stories.discover')}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
