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
                {t('privacy.introduction')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('privacy.introduction.text')}
              </p>
            </section>

            {/* Data Collection */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.dataCollection')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {t('privacy.dataCollection.intro')}
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataCollection.item1')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataCollection.item2')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataCollection.item3')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataCollection.item4')}</span>
                </li>
              </ul>
            </section>

            {/* Data Usage */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.dataUsage')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {t('privacy.dataUsage.intro')}
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataUsage.item1')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataUsage.item2')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataUsage.item3')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.dataUsage.item4')}</span>
                </li>
              </ul>
            </section>

            {/* Security */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.security')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('privacy.security.text')}
              </p>
            </section>

            {/* Rights */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.rights')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {t('privacy.rights.intro')}
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.rights.item1')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.rights.item2')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.rights.item3')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t('privacy.rights.item4')}</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-card rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                {t('privacy.contact')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {t('privacy.contact.intro')}
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>{t('privacy.contact.email')} <a href="mailto:contact@mistery.pro" className="text-red-600 hover:text-red-500 transition-colors">contact@mistery.pro</a></p>
                <p>{t('privacy.contact.address')}</p>
              </div>
            </section>

            {/* Last Updated */}
            <p className="text-center text-muted-foreground text-sm">
              {t('privacy.lastUpdated')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
