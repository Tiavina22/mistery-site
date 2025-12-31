import { useState } from 'react';
import { Menu, X, Moon, Sun, Globe, LogIn, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

export default function MisteryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Explore', href: '#stories' },
    { label: 'Nouveauté', href: '#trending' },
    { label: 'Ma Bibliothèque', href: '#library' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/90 to-transparent backdrop-blur-md border-b border-red-600/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                MISTERY
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/50 hover:bg-gray-800 transition-colors text-xs font-medium text-gray-300 hidden sm:flex"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-900/50 hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Button 
                  className="hidden lg:flex bg-red-600 hover:bg-red-700 text-white font-bold rounded-full"
                  onClick={() => navigate('/creator/login')}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Se Connecter
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden lg:flex text-gray-300 hover:text-white"
                  onClick={() => navigate('/creator/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Déconnexion
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 border-t border-gray-700">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {!isAuthenticated && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-900 rounded transition-colors"
                  onClick={() => {
                    navigate('/creator/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Se Connecter
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
