import { 
  Play, 
  BookOpen, 
  Moon, 
  Globe, 
  Heart, 
  MessageCircle, 
  Bell, 
  Crown 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Play,
    titleKey: 'features.streaming.title',
    descKey: 'features.streaming.desc',
  },
  {
    icon: BookOpen,
    titleKey: 'features.series.title',
    descKey: 'features.series.desc',
  },
  {
    icon: Moon,
    titleKey: 'features.theme.title',
    descKey: 'features.theme.desc',
  },
  {
    icon: Globe,
    titleKey: 'features.language.title',
    descKey: 'features.language.desc',
  },
  {
    icon: Heart,
    titleKey: 'features.favorites.title',
    descKey: 'features.favorites.desc',
  },
  {
    icon: MessageCircle,
    titleKey: 'features.comments.title',
    descKey: 'features.comments.desc',
  },
  {
    icon: Bell,
    titleKey: 'features.notifications.title',
    descKey: 'features.notifications.desc',
  },
  {
    icon: Crown,
    titleKey: 'features.premium.title',
    descKey: 'features.premium.desc',
  },
];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden bg-black">
      {/* Background decoration */}
      <div className="absolute top-1/4 -right-64 w-96 h-96 rounded-full bg-[#1DB954]/10 blur-3xl" />
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 rounded-full bg-[#1DB954]/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6 text-white">
            {t('features.title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-400">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="group p-5 lg:p-6 rounded-xl bg-[#181818] border-none hover:bg-[#282828] transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#1DB954]/10 flex items-center justify-center mb-4 group-hover:bg-[#1DB954]/20 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5 text-[#1DB954]" />
                </div>
                
                {/* Content */}
                <h3 className="text-base lg:text-lg font-heading font-semibold mb-1.5 text-white group-hover:text-[#1DB954] transition-colors">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-gray-400">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
