import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function MisteryFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              MISTERY
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              La plateforme de streaming de histoires malgaches authentiques
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/Mistery.tantara" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a> 
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Aide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Contact</h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Avez-vous une question? Contactez-nous
              </p>
              <a href="mailto:contact@mistery.pro" className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors">
                <Mail className="w-4 h-4" />
                contact@mistery.pro
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} Lyrify. Tous les droits réservés.
            </p>
            <p className="text-muted-foreground text-xs">
              With ❤️ in Madagascar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
