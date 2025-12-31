import { PenTool, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const creatorBenefits = [
  {
    icon: PenTool,
    titleKey: 'creators.publish.title',
    descKey: 'creators.publish.desc',
  },
  {
    icon: TrendingUp,
    titleKey: 'creators.earn.title',
    descKey: 'creators.earn.desc',
  },
  {
    icon: Users,
    titleKey: 'creators.community.title',
    descKey: 'creators.community.desc',
  },
];

export default function CreatorsSection() {
  const { t } = useLanguage();

  return (
    <section id="creators" className="py-20 lg:py-32 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1DB954]/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 lg:mb-6 text-foreground">
                {t('creators.title')}
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground">
                {t('creators.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {creatorBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.titleKey}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border-none hover:bg-secondary transition-colors group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1DB954]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1 text-foreground group-hover:text-[#1DB954] transition-colors">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="text-muted-foreground">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] font-bold">
              <PenTool className="w-5 h-5" />
              {t('creators.cta')}
            </Button>
          </div>

          {/* Illustration */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-border/50 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-border/30 animate-[spin_20s_linear_infinite_reverse]" />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                  <PenTool className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center animate-float">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div className="absolute bottom-4 left-1/4 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="absolute bottom-1/4 right-4 w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-2xl">🇲🇬</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
