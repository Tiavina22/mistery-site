import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // Hide success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-[#1DB954] transition-colors">
            ← {t('common.back') || 'Retour'}
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center">
                <Mail className="w-8 h-8 text-black" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
              {t('contact.title') || 'Contactez-nous'}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle') || 'Notre équipe est là pour répondre à vos questions et vous accompagner'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-card rounded-2xl p-6 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Email</h3>
              <a href="mailto:contact@appistery.mg" className="text-muted-foreground hover:text-[#1DB954] transition-colors">
                contact@appistery.mg
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Téléphone</h3>
              <a href="tel:+261340000000" className="text-muted-foreground hover:text-[#1DB954] transition-colors">
                +261 34 00 000 00
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Adresse</h3>
              <p className="text-gray-400">
                Antananarivo, Madagascar
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-white">
                Envoyez-nous un message
              </h2>

              {isSuccess && (
                <Alert className="mb-6 bg-[#1DB954]/10 border-[#1DB954]/50 text-[#1DB954]">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Nom complet *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground font-semibold">
                    Sujet *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Objet de votre message"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground font-semibold">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Écrivez votre message ici..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#1DB954] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105 gap-2"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                  Questions fréquentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Comment devenir créateur ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Inscrivez-vous via l'espace créateur et soumettez votre profil. Notre équipe validera votre compte sous 48h.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Comment fonctionne l'abonnement Premium ?</h4>
                    <p className="text-sm text-muted-foreground">
                      L'abonnement Premium vous donne un accès illimité à toutes les histoires pour un tarif mensuel fixe.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Puis-je annuler mon abonnement ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, vous pouvez annuler à tout moment depuis vos paramètres. L'annulation prend effet à la fin du mois en cours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/10 border-2 border-[#1DB954] rounded-2xl p-6">
                <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                  Support Créateurs
                </h3>
                <p className="text-muted-foreground mb-4">
                  Vous êtes créateur et avez besoin d'aide ? Contactez notre équipe dédiée pour un support prioritaire.
                </p>
                <Link
                  to="/creator/login"
                  className="inline-block px-6 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105"
                >
                  Espace Créateur
                </Link>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                  Réseaux sociaux
                </h3>
                <p className="text-muted-foreground mb-4">
                  Suivez-nous sur nos réseaux pour ne rien manquer de nos actualités et nouvelles histoires.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-secondary hover:bg-[#1DB954] rounded-full flex items-center justify-center transition-colors">
                    <span className="text-foreground">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-secondary hover:bg-[#1DB954] rounded-full flex items-center justify-center transition-colors">
                    <span className="text-foreground">𝕏</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-secondary hover:bg-[#1DB954] rounded-full flex items-center justify-center transition-colors">
                    <span className="text-foreground">in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
