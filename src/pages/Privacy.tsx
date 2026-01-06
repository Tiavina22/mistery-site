import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function MisteryPrivacy() {
  const { t } = useLanguage();

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
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('privacy.title') || 'Politique de Confidentialité'}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('privacy.subtitle') || 'Votre vie privée est importante pour nous'}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.introduction') || 'Introduction'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
              <p>MISTERY (plateforme de streaming d'histoires) s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.</p>
              </p>
            </section>

            {/* Data Collection */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.dataCollection') || 'Collecte de Données'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Nous collectons les informations suivantes:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Informations d'identification (nom, email, adresse)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Données de compte (nom d'utilisateur, mot de passe chiffré)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Informations de paiement (traitées de manière sécurisée)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Données d'utilisation (pages visitées, historique de lecture)</span>
                </li>
              </ul>
            </section>

            {/* Data Usage */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.dataUsage') || 'Utilisation des Données'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Nous utilisons vos données pour:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Fournir et améliorer nos services</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Gérer votre compte et traiter les paiements</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Vous envoyer des mises à jour et notifications</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Sécuriser notre plateforme contre les fraudes</span>
                </li>
              </ul>
            </section>

            {/* Security */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.security') || 'Sécurité des Données'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nous utilisons le chiffrement SSL/TLS pour protéger vos données en transit. Vos mots de passe sont chiffrés et jamais stockés en clair. Nous maintenons des mesures de sécurité strictes pour prévenir l'accès non autorisé.
              </p>
            </section>

            {/* Rights */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.rights') || 'Vos Droits'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Vous avez le droit de:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Accéder à vos données personnelles</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Demander la correction de vos données</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Demander la suppression de votre compte</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Vous retirer de nos communications marketing</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.contact') || 'Nous Contacter'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité, veuillez nous contacter:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: <a href="mailto:contact@mistery.pro" className="text-red-600 hover:text-red-500 transition-colors">contact@mistery.pro</a></p>
                <p>Adresse: Madagascar</p>
              </div>
            </section>

            {/* Last Updated */}
            <p className="text-center text-muted-foreground text-sm">
              {t('privacy.lastUpdated') || 'Dernière mise à jour: janvier 2026'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
