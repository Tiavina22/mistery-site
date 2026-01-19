import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, Book, LifeBuoy } from 'lucide-react';

export default function MisteryHelp() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('help.faq.q1'),
      answer: t('help.faq.a1')
    },
    {
      question: t('help.faq.q2'),
      answer: t('help.faq.a2')
    },
    {
      question: t('help.faq.q3'),
      answer: t('help.faq.a3')
    },
    {
      question: t('help.faq.q4'),
      answer: t('help.faq.a4')
    },
    {
      question: t('help.faq.q5'),
      answer: t('help.faq.a5')
    },
    {
      question: t('help.faq.q6'),
      answer: t('help.faq.a6')
    }
  ];

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
              <HelpCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('help.title')}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('help.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <a href="mailto:contact@mistery.pro" className="bg-card rounded-2xl p-8 hover:border-red-600 transition-colors border border-border">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-bold text-foreground">{t('help.email.title')}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t('help.email.desc')}</p>
            </a>

            <Link to="/contact" className="bg-card rounded-2xl p-8 hover:border-red-600 transition-colors border border-border">
              <div className="flex items-center gap-4 mb-4">
                <LifeBuoy className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-bold text-foreground">{t('help.support.title')}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t('help.support.desc')}</p>
            </Link>

            <div className="bg-card rounded-2xl p-8 hover:border-red-600 transition-colors border border-border">
              <div className="flex items-center gap-4 mb-4">
                <Book className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-bold text-foreground">{t('help.faq.title')}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t('help.faq.desc')}</p>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold mb-8 text-foreground">
              {t('help.faq.section')}
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:border-red-600/50 transition-colors"
                >
                  <summary className="flex items-center justify-between w-full px-6 py-4 cursor-pointer">
                    <h3 className="font-semibold text-foreground text-lg pr-4">
                      {faq.question}
                    </h3>
                    <span className="flex-shrink-0 text-red-600 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Still need help */}
          <section className="bg-card rounded-2xl p-8 lg:p-12 border border-red-600/20">
            <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
              {t('help.contact.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t('help.contact.desc')}
            </p>
            <a
              href="mailto:contact@mistery.pro"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {t('help.contact.button')}
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
