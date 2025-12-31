import { Download, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-background">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Overlay for light mode */}
        <div className="absolute inset-0 bg-background/85" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-[#1DB954]/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#1DB954]/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm shadow-xl animate-fade-up opacity-0 border border-border">
               <img 
              src="/logo/logo-appistery-no.png" 
              alt="APPISTERY" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
              <span className="font-heading font-semibold text-lg text-foreground">APPISTERY</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight animate-fade-up opacity-0 stagger-1">
              <span className="text-foreground">{t('hero.title').split(' ').slice(0, -1).join(' ')}</span>{' '}
              <span className="text-[#1DB954]">{t('hero.title').split(' ').slice(-1)}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-up opacity-0 stagger-2">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up opacity-0 stagger-3">
              <Button size="lg" className="group gap-2 text-base bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105">
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                {t('hero.cta')}
              </Button>
              <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t('hero.badge')}</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end animate-fade-up opacity-0 stagger-4">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl transform scale-150 opacity-50" />
              
              {/* Phone frame */}
              <div className="relative w-64 sm:w-72 lg:w-80 aspect-[9/19] rounded-[2.5rem] bg-card border-4 border-muted shadow-card overflow-hidden animate-float">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-muted rounded-b-2xl" />
                
                {/* Screen content */}
                <div className="absolute inset-4 top-8 rounded-2xl bg-background overflow-hidden">
                  {/* App header */}
                  <div className="h-14 bg-card flex items-center justify-between px-4 border-b border-border">
                    <div className="flex items-center gap-2">
                       <img 
              src="/logo/logo-appistery-no.png" 
              alt="APPISTERY" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
                      <span className="font-heading font-semibold text-sm">APPISTERY</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-muted" />
                  </div>
                  
                  {/* Story cards preview */}
                  <div className="p-3 space-y-3">
                    {/* Featured story */}
                    <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-2 w-20 bg-foreground/80 rounded mb-1" />
                        <div className="h-1.5 w-16 bg-muted-foreground/50 rounded" />
                      </div>
                    </div>
                    
                    {/* Story list */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-muted to-secondary" />
                        <div className="flex-1 py-1">
                          <div className="h-2 w-24 bg-foreground/60 rounded mb-2" />
                          <div className="h-1.5 w-full bg-muted-foreground/30 rounded mb-1" />
                          <div className="h-1.5 w-3/4 bg-muted-foreground/30 rounded" />
                          <div className="mt-2 h-4 w-16 rounded-full bg-primary/20" />
                        </div>
                      </div>
                    ))}
                  </div>
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
