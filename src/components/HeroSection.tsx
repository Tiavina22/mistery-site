import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const illustrations = [
  { src: '/illustrations/ody.png', alt: 'Ody' },
  { src: '/illustrations/ouija.png', alt: 'Ouija' },
  { src: '/illustrations/rohy.png', alt: 'Rohy' },
  { src: '/illustrations/sahala.PNG', alt: 'Sahala' },
  { src: '/illustrations/silampanahy.png', alt: 'Silampanahy' },
  { src: '/illustrations/stanley.png', alt: 'Stanley' },
  { src: '/illustrations/taxi.png', alt: 'Taxi' },
  { src: '/illustrations/vadydevoly.png', alt: 'Vadydevoly' },
];

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

          {/* Right: Scrolling Illustrations Grid */}
          <div className="relative h-[500px] lg:h-[600px] animate-fade-up stagger-3 overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes scroll-up {
                0% {
                  transform: translateY(0);
                }
                100% {
                  transform: translateY(-50%);
                }
              }
              @keyframes scroll-down {
                0% {
                  transform: translateY(-50%);
                }
                100% {
                  transform: translateY(0);
                }
              }
              .scroll-col-1 {
                animation: scroll-up 25s linear infinite;
              }
              .scroll-col-2 {
                animation: scroll-down 30s linear infinite;
              }
              .scroll-col-3 {
                animation: scroll-up 28s linear infinite;
              }
              .scroll-col-4 {
                animation: scroll-down 32s linear infinite;
              }
              .scroll-col-5 {
                animation: scroll-up 27s linear infinite;
              }
            `}} />
            
            <div className="flex gap-2 h-full" style={{ perspective: '800px' }}>
              {/* Column 1 */}
              <div className="flex-1 overflow-hidden">
                <div className="scroll-col-1 flex flex-col gap-3">
                  {illustrations.slice(0, 5).concat(illustrations.slice(0, 5)).map((illustration, index) => (
                    <div 
                      key={`col1-${index}`}
                      className="flex-shrink-0 w-full h-48 lg:h-56 rounded-lg overflow-hidden shadow-xl bg-card hover:scale-105 transition-all duration-300"
                      style={{ 
                        transform: `rotateY(-8deg) rotateX(${Math.sin(index * 0.4) * 2}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex-1 overflow-hidden">
                <div className="scroll-col-2 flex flex-col gap-3">
                  {illustrations.slice(0, 5).concat(illustrations.slice(0, 5)).map((illustration, index) => (
                    <div 
                      key={`col2-${index}`}
                      className="flex-shrink-0 w-full h-52 lg:h-60 rounded-lg overflow-hidden shadow-xl bg-card hover:scale-105 transition-all duration-300"
                      style={{ 
                        transform: `rotateY(-8deg) rotateX(${Math.sin(index * 0.4 + 1) * 2}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex-1 overflow-hidden">
                <div className="scroll-col-3 flex flex-col gap-3">
                  {illustrations.slice(0, 5).concat(illustrations.slice(0, 5)).map((illustration, index) => (
                    <div 
                      key={`col3-${index}`}
                      className="flex-shrink-0 w-full h-50 lg:h-58 rounded-lg overflow-hidden shadow-xl bg-card hover:scale-105 transition-all duration-300"
                      style={{ 
                        transform: `rotateY(-8deg) rotateX(${Math.sin(index * 0.4 + 2) * 2}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4 */}
              <div className="flex-1 overflow-hidden">
                <div className="scroll-col-4 flex flex-col gap-3">
                  {illustrations.slice(0, 5).concat(illustrations.slice(0, 5)).map((illustration, index) => (
                    <div 
                      key={`col4-${index}`}
                      className="flex-shrink-0 w-full h-48 lg:h-56 rounded-lg overflow-hidden shadow-xl bg-card hover:scale-105 transition-all duration-300"
                      style={{ 
                        transform: `rotateY(-8deg) rotateX(${Math.sin(index * 0.4 + 3) * 2}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 5 */}
              <div className="flex-1 overflow-hidden">
                <div className="scroll-col-5 flex flex-col gap-3">
                  {illustrations.slice(0, 5).concat(illustrations.slice(0, 5)).map((illustration, index) => (
                    <div 
                      key={`col5-${index}`}
                      className="flex-shrink-0 w-full h-52 lg:h-60 rounded-lg overflow-hidden shadow-xl bg-card hover:scale-105 transition-all duration-300"
                      style={{ 
                        transform: `rotateY(-8deg) rotateX(${Math.sin(index * 0.4 + 4) * 2}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
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
