import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    { key: 'footer.about', href: '/about' },
    { key: 'footer.terms', href: '/terms' },
    { key: 'footer.contact', href: '/contact' },
  ];

  return (
    <footer className="py-12 lg:py-16 border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Logo & Description */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
              <img 
              src="/logo/logo-appistery-no.png" 
              alt="APPISTERY" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
              <span className="font-heading font-bold text-xl text-white">APPISTERY</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs mx-auto lg:mx-0">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-6 lg:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Contact & Made in */}
          <div className="text-center lg:text-right space-y-2">
            <a 
              href="mailto:contact@appistery.mg" 
              className="text-sm text-gray-400 hover:text-[#1DB954] transition-colors block"
            >
              contact@appistery.mg
            </a>
            <p className="text-sm text-gray-400 flex items-center justify-center lg:justify-end gap-2">
              {t('footer.made')} <span className="text-lg">🇲🇬</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
