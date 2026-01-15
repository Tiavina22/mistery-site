import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center py-20 lg:py-24 overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-[#1DB954]/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#1DB954]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-6 max-w-2xl">
            {/* Title with emoji */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up">
              <span className="text-foreground">{t('hero.greeting')} </span>
              <span className="text-foreground">APPISTERY</span>
              <span className="inline-block ml-3">👋</span>
            </h1>

            {/* Description paragraphs */}
            <div className="space-y-4 text-base lg:text-lg text-muted-foreground animate-fade-up stagger-1">
              <p>
                <strong className="text-foreground">{t('hero.problem')}</strong> {t('hero.problemDesc')}
              </p>

              <div className="pl-6 border-l-4 border-[#1DB954] space-y-3 py-2">
                <p className="text-foreground font-semibold text-lg">
                  {t('hero.whatIsAppistery')}
                </p>

                <div className="space-y-2">
                  <p>
                    <span className="text-[#1DB954] mr-2">✓</span>
                    <strong className="text-foreground">{t('hero.feature1')}</strong> {t('hero.feature1Desc')}
                  </p>
                  <p>
                    <span className="text-[#1DB954] mr-2">✓</span>
                    <strong className="text-foreground">{t('hero.feature2')}</strong> {t('hero.feature2Desc')}
                  </p>
                  <p>
                    <span className="text-[#1DB954] mr-2">✓</span>
                    <strong className="text-foreground">{t('hero.feature3')}</strong> {t('hero.feature3Desc')}
                  </p>
                </div>
              </div>

              <p>
                {t('hero.conclusion')}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex gap-4 animate-fade-up stagger-2 pt-4">
              <Button 
              size="lg" 
              className="gap-2 text-base bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold rounded-full px-8 transition-all hover:scale-105"
              >
              <Download className="w-5 h-5" />
              {t('hero.cta')}
              </Button>
            </div>
          </div>

          {/* Right: Image Collage */}
          <div className="relative h-[500px] hidden lg:block animate-fade-up stagger-3">
            {/* Large main image - top left */}
            <div 
              className="absolute top-0 left-0 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(-3deg)' }}
            >
              <img src="/illustrations/ody.png" alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Medium image - top right */}
            <div 
              className="absolute top-12 right-8 w-56 h-64 rounded-2xl overflow-hidden shadow-xl bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(5deg)' }}
            >
              <img src="/illustrations/ouija.png" alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Small image - middle left */}
            <div 
              className="absolute top-48 left-12 w-48 h-56 rounded-xl overflow-hidden shadow-lg bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(2deg)' }}
            >
              <img src="/illustrations/rohy.png" alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Large image - bottom center */}
            <div 
              className="absolute bottom-12 left-32 w-72 h-72 rounded-2xl overflow-hidden shadow-2xl bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(-2deg)' }}
            >
              <img src="/illustrations/silampanahy.png" alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Medium image - bottom right */}
            <div 
              className="absolute bottom-20 right-0 w-52 h-60 rounded-xl overflow-hidden shadow-xl bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(4deg)' }}
            >
              <img src="/illustrations/stanley.png" alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Small image - middle right */}
            <div 
              className="absolute top-32 right-20 w-44 h-52 rounded-xl overflow-hidden shadow-lg bg-card border border-[#1DB954]/30 hover:scale-105 hover:z-30 transition-all duration-300"
              style={{ transform: 'rotate(-4deg)' }}
            >
              <img src="/illustrations/taxi.png" alt="Story" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in opacity-0 stagger-5 z-10">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
