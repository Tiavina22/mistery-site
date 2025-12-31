import { useState } from 'react';
import { Menu, X, Moon, Sun, Globe, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { key: 'nav.concept', href: '#concept' },
    { key: 'nav.stories', href: '#stories' },
    { key: 'nav.features', href: '#features' },
    { key: 'nav.creators', href: '#creators' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img 
              src="/logo/logo-appistery-no.png" 
              alt="APPISTERY" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
            <span className="font-heading font-bold text-xl lg:text-2xl text-foreground group-hover:text-[#1DB954] transition-colors">
              APPISTERY
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#1DB954]" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Download Button (Desktop) */}
            <Button className="hidden lg:flex bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105" size="sm">
              {t('nav.download')}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-background">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              <Button className="w-full mt-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full" onClick={() => setIsMenuOpen(false)}>
                {t('nav.download')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
