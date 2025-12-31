import { Check, Shield, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AccessSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6 text-foreground">
            {t('access.title')}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            {t('access.subtitle')}
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-12 lg:mb-16">
          {/* Free Plan */}
          <div className="p-6 lg:p-8 rounded-2xl bg-card border-none hover:bg-secondary transition-colors">
            <h3 className="text-xl lg:text-2xl font-heading font-bold mb-2 text-foreground">
              {t('access.free.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('access.free.desc')}
            </p>
            <ul className="space-y-3">
              {['access.free.feature1', 'access.free.feature2', 'access.free.feature3'].map((key) => (
                <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/10 border-2 border-[#1DB954] relative overflow-hidden">
            {/* Premium badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#1DB954] text-black text-xs font-semibold">
              Premium
            </div>
            
            <h3 className="text-xl lg:text-2xl font-heading font-bold mb-2 text-[#1DB954]">
              {t('access.premium.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('access.premium.desc')}
            </p>
            <ul className="space-y-3">
              {['access.premium.feature1', 'access.premium.feature2', 'access.premium.feature3', 'access.premium.feature4'].map((key) => (
                <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-[#1DB954]/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#1DB954]" />
                  </div>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional info */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card border-none">
            <div className="w-10 h-10 rounded-lg bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-[#1DB954]" />
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-1 text-foreground">{t('access.support')}</h4>
              <p className="text-sm text-muted-foreground">{t('access.support.desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card border-none">
            <div className="w-10 h-10 rounded-lg bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#1DB954]" />
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-1 text-foreground">{t('access.secure')}</h4>
              <p className="text-sm text-muted-foreground">{t('access.secure.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
