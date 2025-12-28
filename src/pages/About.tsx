import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Users, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
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
                <BookOpen className="w-8 h-8 text-black" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white">
              {t('about.title') || 'À propos d\'APPISTERY'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
              {t('about.subtitle') || 'La plateforme de streaming d\'histoires vraies de Madagascar'}
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="bg-[#181818] rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-6 text-white">
                {t('about.mission') || 'Notre Mission'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-4">
                APPISTERY est née d'une passion pour les histoires authentiques de Madagascar. Notre mission est de donner une voix aux expériences vécues, aux témoignages paranormaux, aux récits mystérieux et aux vécus qui font la richesse de notre culture malgache.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Nous croyons que chaque histoire mérite d'être racontée et partagée. À travers notre plateforme, nous connectons les créateurs avec une audience passionnée par l'authenticité et le mystère.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-[#181818] rounded-2xl p-6 hover:bg-[#282828] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-white">
                {t('about.authenticity') || 'Authenticité'}
              </h3>
              <p className="text-gray-400">
                Nous valorisons les histoires vraies et les témoignages réels. Chaque récit sur APPISTERY est une expérience vécue, racontée avec sincérité.
              </p>
            </div>

            <div className="bg-[#181818] rounded-2xl p-6 hover:bg-[#282828] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-white">
                {t('about.community') || 'Communauté'}
              </h3>
              <p className="text-gray-400">
                Nous construisons une communauté où créateurs et auditeurs partagent leur passion pour les histoires captivantes et mystérieuses.
              </p>
            </div>

            <div className="bg-[#181818] rounded-2xl p-6 hover:bg-[#282828] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-white">
                {t('about.culture') || 'Culture Malgache'}
              </h3>
              <p className="text-gray-400">
                Nous célébrons et préservons les histoires qui font partie du patrimoine culturel malgache, en les rendant accessibles à tous.
              </p>
            </div>

            <div className="bg-[#181818] rounded-2xl p-6 hover:bg-[#282828] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 text-white">
                {t('about.support') || 'Soutien aux Créateurs'}
              </h3>
              <p className="text-gray-400">
                Nous offrons aux créateurs les outils et la plateforme pour monétiser leur talent et toucher une large audience.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/10 border-2 border-[#1DB954] rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-4 text-white">
              {t('about.team') || 'Rejoignez l\'aventure'}
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Que vous soyez créateur d'histoires ou passionné d'écoute, APPISTERY vous attend. Ensemble, faisons vivre les histoires de Madagascar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/creator/register"
                className="px-8 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all hover:scale-105 inline-block"
              >
                Devenir Créateur
              </Link>
              <Link
                to="/"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all inline-block"
              >
                Découvrir les histoires
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
