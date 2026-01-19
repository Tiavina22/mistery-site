import { Download, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 via-background to-[#1DB954]/5" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-[#1DB954]/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-[#1DB954]/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <img 
              src="/logo/logo-appistery-no.png" 
              alt="APPISTERY" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6 text-foreground">
            {t('cta.title')}
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 lg:mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/apk/appistery-beta.apk" download="appistery-beta.apk">
              <Button size="lg" className="group gap-2 text-base px-8 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105">
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                {t('cta.button')}
              </Button>
            </a>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t('cta.android')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
