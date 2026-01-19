import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, Users, Target, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisteryAbout() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-red-600 transition-colors">
            ← {t('common.back')}
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-5xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                MISTERY
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('about.title')}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-red-600/10">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-6 text-foreground">
                {t('about.mission')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {t('about.mission.text1')}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.mission.text2')}
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                {t('about.authenticity.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('about.authenticity.desc')}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                {t('about.community.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('about.community.desc')}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                {t('about.immersive.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('about.immersive.desc')}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                {t('about.cultural.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('about.cultural.desc')}
              </p>
            </div>
          </div>

          {/* Why MISTERY Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold mb-8 text-foreground text-center">
              {t('about.whyChoose')}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('about.exclusive.title')}</h3>
                  <p className="text-muted-foreground text-sm">{t('about.exclusive.desc')}</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('about.secure.title')}</h3>
                  <p className="text-muted-foreground text-sm">{t('about.secure.desc')}</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('about.unlimited.title')}</h3>
                  <p className="text-muted-foreground text-sm">{t('about.unlimited.desc')}</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('about.regular.title')}</h3>
                  <p className="text-muted-foreground text-sm">{t('about.regular.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="bg-red-600/10 rounded-2xl p-8 lg:p-12 border border-red-600/20">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-6 text-foreground text-center">
                {t('about.team.title')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-center">
                {t('about.team.desc')}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
              {t('about.cta.title')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('about.cta.desc')}
            </p>
            <Link 
              to="/" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {t('about.cta.button')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
