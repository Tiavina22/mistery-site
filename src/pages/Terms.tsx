import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, FileText, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#1DB954] transition-colors">
            ← {t('common.back') || 'Retour'}
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center">
                <FileText className="w-8 h-8 text-black" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white">
              {t('terms.title') || 'Conditions Générales d\'Utilisation'}
            </h1>
            <p className="text-lg text-gray-400">
              Dernière mise à jour : 28 Décembre 2025
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <a href="#acceptance" className="bg-[#181818] rounded-xl p-4 hover:bg-[#282828] transition-colors">
              <Shield className="w-6 h-6 text-[#1DB954] mb-2" />
              <h3 className="text-white font-semibold mb-1">Acceptation</h3>
              <p className="text-sm text-gray-400">Conditions d'utilisation</p>
            </a>
            <a href="#users" className="bg-[#181818] rounded-xl p-4 hover:bg-[#282828] transition-colors">
              <Users className="w-6 h-6 text-[#1DB954] mb-2" />
              <h3 className="text-white font-semibold mb-1">Utilisateurs</h3>
              <p className="text-sm text-gray-400">Droits et obligations</p>
            </a>
            <a href="#content" className="bg-[#181818] rounded-xl p-4 hover:bg-[#282828] transition-colors">
              <AlertCircle className="w-6 h-6 text-[#1DB954] mb-2" />
              <h3 className="text-white font-semibold mb-1">Contenu</h3>
              <p className="text-sm text-gray-400">Propriété intellectuelle</p>
            </a>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                1. Acceptation des Conditions
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  En accédant et en utilisant APPISTERY, vous acceptez d'être lié par ces Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
                <p>
                  APPISTERY se réserve le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="users" className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                2. Compte Utilisateur
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>La confidentialité de vos informations de connexion</li>
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
            <section id="content" className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                3. Contenu et Propriété Intellectuelle
              </h2>
              <div className="space-y-4 text-gray-400">
                <h3 className="text-lg font-semibold text-white">3.1 Contenu des Créateurs</h3>
                <p>
                  Les créateurs conservent tous les droits sur leur contenu. En publiant sur APPISTERY, vous accordez à la plateforme une licence non exclusive pour diffuser, promouvoir et distribuer votre contenu.
                </p>
                
                <h3 className="text-lg font-semibold text-white">3.2 Contenu Interdit</h3>
                <p>Il est strictement interdit de publier du contenu :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Diffamatoire, haineux ou discriminatoire</li>
                  <li>Violant les droits d'autrui</li>
                  <li>Pornographique ou explicitement sexuel</li>
                  <li>Encourageant la violence ou les activités illégales</li>
                  <li>Contenant des virus ou codes malveillants</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                4. Abonnement Premium
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  L'abonnement Premium offre un accès illimité à tout le contenu. Les paiements sont mensuels et automatiquement renouvelés sauf annulation.
                </p>
                <p>
                  Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. L'annulation prend effet à la fin de la période en cours.
                </p>
                <p>
                  Aucun remboursement n'est accordé pour les périodes partiellement utilisées.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                5. Limitation de Responsabilité
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  APPISTERY fournit la plateforme "telle quelle". Nous ne garantissons pas :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>L'exactitude ou la véracité du contenu créé par les utilisateurs</li>
                  <li>La disponibilité ininterrompue du service</li>
                  <li>L'absence d'erreurs ou de bugs</li>
                </ul>
                <p>
                  APPISTERY ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                6. Résiliation
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  APPISTERY se réserve le droit de suspendre ou de supprimer votre compte en cas de violation de ces conditions, sans préavis ni remboursement.
                </p>
                <p>
                  Vous pouvez supprimer votre compte à tout moment depuis vos paramètres.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-[#181818] rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-white">
                7. Loi Applicable
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Ces conditions sont régies par les lois de Madagascar. Tout litige sera soumis aux tribunaux compétents de Madagascar.
                </p>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/10 border-2 border-[#1DB954] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-heading font-bold mb-3 text-white">
              Des questions sur nos CGU ?
            </h3>
            <p className="text-gray-400 mb-6">
              Notre équipe est là pour vous aider à comprendre vos droits et obligations.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
