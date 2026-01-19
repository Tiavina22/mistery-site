import { useLanguage } from '@/contexts/LanguageContext';

export default function PaymentMethodsSection() {
  const { t } = useLanguage();

  const paymentMethods = [
    { src: '/paiement/logovisa.svg', alt: 'Visa' },
    { src: '/paiement/logomastercard.svg', alt: 'Mastercard' },
    { src: '/paiement/logopaypal.svg', alt: 'PayPal' },
    { src: '/paiement/logomvola.svg', alt: 'MVola' },
    { src: '/paiement/logoorange.svg', alt: 'Orange Money' },
    { src: '/paiement/logoairtel.svg', alt: 'Airtel Money' },
  ];

  return (
    <section className="py-12 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider">
          {t('payment.methods.title')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {paymentMethods.map((method) => (
            <div
              key={method.alt}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={method.src}
                alt={method.alt}
                className="h-8 md:h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
