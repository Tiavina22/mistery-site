import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    { key: 'footer.about', href: '#' },
    { key: 'footer.terms', href: '#' },
    { key: 'footer.contact', href: '#' },
  ];

  return (
    <footer className="py-12 lg:py-16 border-t border-border bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Logo & Description */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-lg">A</span>
              </div>
              <span className="font-heading font-bold text-xl">APPISTERY</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto lg:mx-0">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-6 lg:gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Contact & Made in */}
          <div className="text-center lg:text-right space-y-2">
            <a 
              href="mailto:contact@appistery.mg" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors block"
            >
              contact@appistery.mg
            </a>
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-end gap-2">
              {t('footer.made')} <span className="text-lg">🇲🇬</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
