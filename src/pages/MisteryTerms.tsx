import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FileText, AlertCircle, Heart, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisteryTerms() {
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
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('terms.title') || 'Conditions Générales d\'Utilisation'}
            </h1>
            <p className="text-lg text-muted-foreground">
              MISTERY - Plateforme de Streaming d'Histoires
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <a href="#acceptance" className="bg-card rounded-xl p-4 hover:border-red-600 border border-border transition-colors">
              <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="text-foreground font-semibold mb-1">Acceptation</h3>
              <p className="text-sm text-muted-foreground">Conditions d'utilisation</p>
            </a>
            <a href="#users" className="bg-card rounded-xl p-4 hover:border-red-600 border border-border transition-colors">
              <Lock className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="text-foreground font-semibold mb-1">Utilisateurs</h3>
              <p className="text-sm text-muted-foreground">Droits et obligations</p>
            </a>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                1. Acceptation des Conditions
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  En accédant et en utilisant MISTERY, vous acceptez d'être lié par ces Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
                <p>
                  MISTERY se réserve le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme.
                </p>
                <p>
                  Ces conditions s'appliquent à tous les utilisateurs de MISTERY, y compris les lecteurs, spectateurs et contributeurs.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="users" className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                2. Compte Utilisateur
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>La confidentialité de vos identifiants de connexion</li>
                  <li>Toutes les activités effectuées via votre compte</li>
                  <li>La mise à jour de vos informations personnelles</li>
                  <li>La notification immédiate en cas d'utilisation non autorisée</li>
                </ul>
                <p>
                  Vous devez avoir au moins 13 ans pour créer un compte. Les mineurs doivent obtenir le consentement parental.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                3. Contenu et Propriété Intellectuelle
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-lg font-semibold text-foreground">3.1 Contenu sur MISTERY</h3>
                <p>
                  Tout le contenu sur MISTERY (histoires, vidéos, images) est fourni à titre divertissant et informatif. MISTERY s'engage à respecter les droits d'auteur et la propriété intellectuelle.
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">3.2 Utilisation Personnelle</h3>
                <p>
                  Vous pouvez voir, lire et regarder le contenu à titre personnel. Il est interdit de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reproduire ou copier le contenu sans autorisation</li>
                  <li>Distribuer ou partager le contenu sur d'autres plateformes</li>
                  <li>Modifier ou créer des œuvres dérivées</li>
                  <li>Utiliser le contenu à des fins commerciales</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                4. Conduite des Utilisateurs
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Vous acceptez de ne pas :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
                  <li>Publier du contenu offensant ou discriminatoire</li>
                  <li>Spam ou contenu malveillant</li>
                  <li>Violer les lois applicables</li>
                  <li>Contourner les mesures de sécurité</li>
                </ul>
                <p>
                  MISTERY se réserve le droit de supprimer tout contenu ou de suspendre les utilisateurs qui violent ces conditions.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                5. Abonnement et Paiement
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MISTERY offre du contenu gratuit et premium. L'accès au contenu premium nécessite un abonnement payant.
                </p>
                <p>
                  Les paiements sont traités de manière sécurisée. Les abonnements se renouvellent automatiquement sauf annulation.
                </p>
                <p>
                  Vous pouvez annuler votre abonnement à tout moment. L'annulation prend effet à la fin de la période en cours.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                6. Limitation de Responsabilité
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MISTERY fournit la plateforme "telle quelle". Nous ne garantissons pas :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>La disponibilité ininterrompue du service</li>
                  <li>L'absence d'erreurs ou de bugs</li>
                  <li>La véracité de certains contenus créatifs</li>
                </ul>
                <p>
                  MISTERY ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                7. Modification du Service
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MISTERY se réserve le droit de modifier, suspendre ou discontinuer le service à tout moment. Nous notifierons les utilisateurs des changements majeurs.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                8. Droit Applicable
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Ces conditions sont régies par les lois de Madagascar. Tout litige sera résolu devant les tribunaux compétents.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-red-600/10 rounded-2xl p-8 border border-red-600/20">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                Questions?
              </h2>
              <p className="text-muted-foreground mb-4">
                Si vous avez des questions sur ces conditions, veuillez nous contacter :
              </p>
              <a href="mailto:contact@mistery.pro" className="text-red-600 hover:text-red-500 transition-colors">
                contact@mistery.pro
              </a>
            </section>

            {/* Last Updated */}
            <p className="text-center text-muted-foreground text-sm">
              Dernière mise à jour: janvier 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
