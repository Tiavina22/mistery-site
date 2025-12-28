import { Play, Sparkles, BookOpen, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const concepts = [
  {
    icon: Play,
    titleKey: 'concept.streaming.title',
    descKey: 'concept.streaming.desc',
  },
  {
    icon: Sparkles,
    titleKey: 'concept.culture.title',
    descKey: 'concept.culture.desc',
  },
  {
    icon: BookOpen,
    titleKey: 'concept.series.title',
    descKey: 'concept.series.desc',
  },
  {
    icon: Smartphone,
    titleKey: 'concept.mobile.title',
    descKey: 'concept.mobile.desc',
  },
];

export default function ConceptSection() {
  const { t } = useLanguage();

  return (
    <section id="concept" className="py-20 lg:py-32 relative overflow-hidden bg-black">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6">
            <span className="text-white">{t('concept.title')}</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-400">
            {t('concept.subtitle')}
          </p>
        </div>

        {/* Concept Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <div
                key={concept.titleKey}
                className="group relative p-6 lg:p-8 rounded-2xl bg-[#181818] border-none hover:bg-[#282828] transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-5 group-hover:bg-[#1DB954]/20 transition-colors">
                  <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-[#1DB954]" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg lg:text-xl font-heading font-semibold mb-2 text-white group-hover:text-[#1DB954] transition-colors">
                  {t(concept.titleKey)}
                </h3>
                <p className="text-gray-400 text-sm lg:text-base">
                  {t(concept.descKey)}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-[#1DB954]/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
