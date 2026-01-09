import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, Users, Target, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisteryAbout() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-red-600 transition-colors">
            ← {t('common.back') || 'Retour'}
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-5xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                MISTERY
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('about.title') || 'À propos de MISTERY'}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle') || 'La plateforme de streaming d\'histoires mystérieuses et authentiques de Madagascar'}
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-red-600/10">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-6 text-foreground">
                {t('about.mission') || 'Notre Mission'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                MISTERY est né d'une passion pour les histoires mystérieuses, les témoignages paranormaux et les récits captivants de Madagascar. Notre mission est de donner une voix aux expériences vécues qui frappent l'imagination et qui incarnent la richesse culturelle et spirituelle de notre île.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nous croyons que chaque histoire mérite d'être entendue. À travers notre plateforme de streaming, nous connectons les conteurs passionnés avec une audience assoiffée de mystère, d'authenticité et d'frissons.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                Histoires Authentiques
              </h3>
              <p className="text-muted-foreground">
                Nous valorisons les récits vrais, les expériences vécues et les témoignages sincères. Chaque histoire sur MISTERY est un voyage dans le mystère et l'insolite.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                Communauté Engagée
              </h3>
              <p className="text-muted-foreground">
                Nous construisons une communauté où les conteurs et les auditeurs partagent leur fascination pour les histoires qui défient l'explication rationnelle.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                Expérience Immersive
              </h3>
              <p className="text-muted-foreground">
                Notre plateforme offre une expérience audio et vidéo captivante qui vous plonge au cœur de chaque mystère et intrigue.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:border-red-600 transition-colors border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                Respect Culturel
              </h3>
              <p className="text-muted-foreground">
                Nous célébrons et préservons le patrimoine cultural malgache en mettant en avant ses histoires les plus captivantes et significatives.
              </p>
            </div>
          </div>

          {/* Why MISTERY Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold mb-8 text-foreground text-center">
              Pourquoi Choisir MISTERY?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Contenu Exclusif</h3>
                  <p className="text-muted-foreground text-sm">Des histoires que vous ne trouverez nulle part ailleurs, racontées par les créateurs eux-mêmes</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Plateforme Sécurisée</h3>
                  <p className="text-muted-foreground text-sm">Vos données et votre expérience sont protégées avec nos mesures de sécurité avancées</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Accès Sans Limites</h3>
                  <p className="text-muted-foreground text-sm">Écoutez et regardez les histoires quand vous voulez, sur tous vos appareils</p>
                </div>
              </div>
              <div className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Nouveau Contenu Régulier</h3>
                  <p className="text-muted-foreground text-sm">Des nouvelles histoires ajoutées chaque semaine pour vous tenir en haleine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="bg-red-600/10 rounded-2xl p-8 lg:p-12 border border-red-600/20">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-6 text-foreground text-center">
                Notre Équipe
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-center">
                MISTERY est dirigée par une équipe passionnée de Madagascar qui croit au pouvoir des histoires pour divertir, inspirer et rapprocher les gens. Chaque membre de notre équipe apporte sa propre expérience et son amour pour les mystères et les récits captivants.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
              Prêt à explorer le mystère?
            </h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez des milliers de passionnés qui découvrent les histoires les plus captivantes de Madagascar
            </p>
            <Link 
              to="/" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Retour à l'Accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
