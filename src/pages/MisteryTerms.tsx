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
            ← {t('common.back')}
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
              {t('terms.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('terms.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <a href="#acceptance" className="bg-card rounded-xl p-4 hover:border-red-600 border border-border transition-colors">
              <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="text-foreground font-semibold mb-1">{t('terms.quickLinks.acceptance')}</h3>
              <p className="text-sm text-muted-foreground">{t('terms.quickLinks.acceptance.desc')}</p>
            </a>
            <a href="#users" className="bg-card rounded-xl p-4 hover:border-red-600 border border-border transition-colors">
              <Lock className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="text-foreground font-semibold mb-1">{t('terms.quickLinks.users')}</h3>
              <p className="text-sm text-muted-foreground">{t('terms.quickLinks.users.desc')}</p>
            </a>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section1.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section1.text1')}
                </p>
                <p>
                  {t('terms.section1.text2')}
                </p>
                <p>
                  {t('terms.section1.text3')}
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="users" className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section2.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section2.text1')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('terms.section2.item1')}</li>
                  <li>{t('terms.section2.item2')}</li>
                  <li>{t('terms.section2.item3')}</li>
                  <li>{t('terms.section2.item4')}</li>
                </ul>
                <p>
                  {t('terms.section2.text2')}
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section3.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-lg font-semibold text-foreground">{t('terms.section3.subtitle1')}</h3>
                <p>
                  {t('terms.section3.text1')}
                </p>
                
                <h3 className="text-lg font-semibold text-foreground">{t('terms.section3.subtitle2')}</h3>
                <p>
                  {t('terms.section3.text2')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('terms.section3.item1')}</li>
                  <li>{t('terms.section3.item2')}</li>
                  <li>{t('terms.section3.item3')}</li>
                  <li>{t('terms.section3.item4')}</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section4.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section4.text1')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('terms.section4.item1')}</li>
                  <li>{t('terms.section4.item2')}</li>
                  <li>{t('terms.section4.item3')}</li>
                  <li>{t('terms.section4.item4')}</li>
                  <li>{t('terms.section4.item5')}</li>
                </ul>
                <p>
                  {t('terms.section4.text2')}
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section5.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section5.text1')}
                </p>
                <p>
                  {t('terms.section5.text2')}
                </p>
                <p>
                  {t('terms.section5.text3')}
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section6.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section6.text1')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('terms.section6.item1')}</li>
                  <li>{t('terms.section6.item2')}</li>
                  <li>{t('terms.section6.item3')}</li>
                </ul>
                <p>
                  {t('terms.section6.text2')}
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section7.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section7.text')}
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.section8.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('terms.section8.text')}
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-red-600/10 rounded-2xl p-8 border border-red-600/20">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {t('terms.contact.title')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('terms.contact.text')}
              </p>
              <a href="mailto:contact@mistery.pro" className="text-red-600 hover:text-red-500 transition-colors">
                contact@mistery.pro
              </a>
            </section>

            {/* Last Updated */}
            <p className="text-center text-muted-foreground text-sm">
              {t('terms.lastUpdated')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
