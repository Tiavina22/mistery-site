import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.concept': 'Concept',
    'nav.stories': 'Histoires',
    'nav.features': 'Fonctionnalités',
    'nav.creators': 'Créateurs',
    'nav.download': 'Télécharger',

    // Hero
    'hero.title': 'Plongez dans les mystères de Madagascar',
    'hero.subtitle': 'Découvrez des histoires vraies issues de la culture malgache. Mystère, paranormal, drames — vivez des récits authentiques en streaming.',
    'hero.cta': 'Télécharger l\'application',
    'hero.badge': 'Disponible sur Android',

    // Concept
    'concept.title': 'Le streaming d\'histoires vraies',
    'concept.subtitle': 'APPISTERY réinvente la façon de vivre les récits authentiques',
    'concept.streaming.title': 'Streaming immersif',
    'concept.streaming.desc': 'Des histoires vraies en streaming, organisées en séries et épisodes pour une expérience de lecture captivante.',
    'concept.culture.title': 'Culture malgache',
    'concept.culture.desc': 'Des récits issus de la richesse culturelle, sociale et mystique de Madagascar.',
    'concept.series.title': 'Séries & Épisodes',
    'concept.series.desc': 'Chaque histoire est structurée en chapitres pour vous tenir en haleine.',
    'concept.mobile.title': 'Lecture mobile',
    'concept.mobile.desc': 'Une expérience optimisée pour votre smartphone, lisez où que vous soyez.',

    // Featured Stories
    'stories.title': 'Histoires en vedette',
    'stories.subtitle': 'Explorez nos récits les plus captivants',
    'stories.discover': 'Découvrir',
    'stories.episodes': 'épisodes',
    'stories.series': 'Série',

    // Story titles and descriptions
    'story1.title': 'Les Ombres du Rova',
    'story1.desc': 'Une série de disparitions mystérieuses près du palais royal révèle d\'anciens secrets.',
    'story2.title': 'Le Guérisseur de Toliara',
    'story2.desc': 'Un ombiasy aux pouvoirs troublants aide à résoudre des crimes inexplicables.',
    'story3.title': 'Voix de l\'Au-delà',
    'story3.desc': 'Des témoignages troublants de contacts avec les ancêtres.',
    'story4.title': 'La Malédiction des Vazimba',
    'story4.desc': 'Une famille découvre que leur terre cache un terrible secret.',

    // Genres
    'genre.mystery': 'Mystère',
    'genre.horror': 'Horreur',
    'genre.paranormal': 'Paranormal',
    'genre.drama': 'Drame',
    'genre.witchcraft': 'Sorcellerie',

    // Features
    'features.title': 'Fonctionnalités',
    'features.subtitle': 'Tout ce dont vous avez besoin pour une expérience immersive',
    'features.streaming.title': 'Streaming d\'histoires vraies',
    'features.streaming.desc': 'Accédez à des récits authentiques basés sur des faits réels de Madagascar.',
    'features.series.title': 'Séries & Chapitres',
    'features.series.desc': 'Des histoires organisées pour une lecture progressive et captivante.',
    'features.theme.title': 'Mode clair / sombre',
    'features.theme.desc': 'Choisissez le thème qui convient à votre moment de lecture.',
    'features.language.title': 'Multilangue FR / EN',
    'features.language.desc': 'Lisez dans la langue de votre choix.',
    'features.favorites.title': 'Favoris',
    'features.favorites.desc': 'Sauvegardez vos histoires préférées pour les retrouver facilement.',
    'features.comments.title': 'Commentaires & Réactions',
    'features.comments.desc': 'Partagez vos impressions avec la communauté.',
    'features.notifications.title': 'Notifications',
    'features.notifications.desc': 'Soyez alerté dès qu\'un nouveau chapitre est disponible.',
    'features.premium.title': 'Abonnement Premium',
    'features.premium.desc': 'Débloquez un accès illimité à tout le contenu.',

    // Access Model
    'access.title': 'Modèle d\'accès',
    'access.subtitle': 'Choisissez la formule qui vous convient',
    'access.free.title': 'Accès Gratuit',
    'access.free.desc': 'Découvrez une sélection d\'histoires gratuitement. Idéal pour explorer la plateforme.',
    'access.free.feature1': 'Histoires gratuites disponibles',
    'access.free.feature2': 'Nouveaux contenus réguliers',
    'access.free.feature3': 'Communauté active',
    'access.premium.title': 'Premium',
    'access.premium.desc': 'Accès illimité à toutes les histoires et fonctionnalités exclusives.',
    'access.premium.feature1': 'Toutes les histoires',
    'access.premium.feature2': 'Sans publicité',
    'access.premium.feature3': 'Chapitres en avant-première',
    'access.premium.feature4': 'Soutien aux créateurs',
    'access.support': 'Soutien aux créateurs',
    'access.support.desc': 'Votre abonnement contribue directement à rémunérer les auteurs.',
    'access.secure': 'Paiement sécurisé',
    'access.secure.desc': 'Transactions protégées et données confidentielles.',

    // Creators
    'creators.title': 'Créateurs de contenu',
    'creators.subtitle': 'La plateforme qui valorise les auteurs malgaches',
    'creators.publish.title': 'Publiez vos histoires',
    'creators.publish.desc': 'Partagez vos récits avec une audience passionnée par la culture malgache.',
    'creators.earn.title': 'Générez des revenus',
    'creators.earn.desc': 'Chaque lecture de vos histoires vous rapporte. Plus vous êtes lu, plus vous gagnez.',
    'creators.community.title': 'Communauté engagée',
    'creators.community.desc': 'Rejoignez une plateforme équitable et transparente qui met les créateurs au premier plan.',
    'creators.cta': 'Devenir créateur',

    // CTA
    'cta.title': 'Prêt à découvrir les mystères de Madagascar ?',
    'cta.subtitle': 'Téléchargez APPISTERY et plongez dans des histoires vraies qui vous feront frissonner.',
    'cta.button': 'Télécharger Appistery',
    'cta.android': 'Disponible sur Android',

    // Footer
    'footer.description': 'La plateforme de streaming d\'histoires vraies issues de la culture malgache.',
    'footer.about': 'À propos',
    'footer.terms': 'CGU',
    'footer.contact': 'Contact',
    'footer.made': 'Fait à Madagascar',
    'footer.rights': '© Appistery – Tous droits réservés',
  },
  en: {
    // Navigation
    'nav.concept': 'Concept',
    'nav.stories': 'Stories',
    'nav.features': 'Features',
    'nav.creators': 'Creators',
    'nav.download': 'Download',

    // Hero
    'hero.title': 'Dive into the mysteries of Madagascar',
    'hero.subtitle': 'Discover true stories from Malagasy culture. Mystery, paranormal, drama — experience authentic tales in streaming.',
    'hero.cta': 'Download the app',
    'hero.badge': 'Available on Android',

    // Concept
    'concept.title': 'True story streaming',
    'concept.subtitle': 'APPISTERY reinvents how you experience authentic tales',
    'concept.streaming.title': 'Immersive streaming',
    'concept.streaming.desc': 'True stories in streaming, organized in series and episodes for a captivating reading experience.',
    'concept.culture.title': 'Malagasy culture',
    'concept.culture.desc': 'Tales from the cultural, social and mystical richness of Madagascar.',
    'concept.series.title': 'Series & Episodes',
    'concept.series.desc': 'Each story is structured in chapters to keep you on the edge.',
    'concept.mobile.title': 'Mobile reading',
    'concept.mobile.desc': 'An optimized experience for your smartphone, read wherever you are.',

    // Featured Stories
    'stories.title': 'Featured Stories',
    'stories.subtitle': 'Explore our most captivating tales',
    'stories.discover': 'Discover',
    'stories.episodes': 'episodes',
    'stories.series': 'Series',

    // Story titles and descriptions
    'story1.title': 'Shadows of the Rova',
    'story1.desc': 'A series of mysterious disappearances near the royal palace reveals ancient secrets.',
    'story2.title': 'The Healer of Toliara',
    'story2.desc': 'An ombiasy with disturbing powers helps solve inexplicable crimes.',
    'story3.title': 'Voices from Beyond',
    'story3.desc': 'Disturbing testimonies of contact with the ancestors.',
    'story4.title': 'The Vazimba Curse',
    'story4.desc': 'A family discovers their land hides a terrible secret.',

    // Genres
    'genre.mystery': 'Mystery',
    'genre.horror': 'Horror',
    'genre.paranormal': 'Paranormal',
    'genre.drama': 'Drama',
    'genre.witchcraft': 'Witchcraft',

    // Features
    'features.title': 'Features',
    'features.subtitle': 'Everything you need for an immersive experience',
    'features.streaming.title': 'True story streaming',
    'features.streaming.desc': 'Access authentic tales based on real events from Madagascar.',
    'features.series.title': 'Series & Chapters',
    'features.series.desc': 'Stories organized for progressive and captivating reading.',
    'features.theme.title': 'Light / Dark mode',
    'features.theme.desc': 'Choose the theme that suits your reading moment.',
    'features.language.title': 'Multilingual FR / EN',
    'features.language.desc': 'Read in the language of your choice.',
    'features.favorites.title': 'Favorites',
    'features.favorites.desc': 'Save your favorite stories for easy access.',
    'features.comments.title': 'Comments & Reactions',
    'features.comments.desc': 'Share your impressions with the community.',
    'features.notifications.title': 'Notifications',
    'features.notifications.desc': 'Get notified when a new chapter is available.',
    'features.premium.title': 'Premium Subscription',
    'features.premium.desc': 'Unlock unlimited access to all content.',

    // Access Model
    'access.title': 'Access Model',
    'access.subtitle': 'Choose the plan that suits you',
    'access.free.title': 'Free Access',
    'access.free.desc': 'Discover a selection of free stories. Perfect for exploring the platform.',
    'access.free.feature1': 'Free stories available',
    'access.free.feature2': 'Regular new content',
    'access.free.feature3': 'Active community',
    'access.premium.title': 'Premium',
    'access.premium.desc': 'Unlimited access to all stories and exclusive features.',
    'access.premium.feature1': 'All stories',
    'access.premium.feature2': 'Ad-free',
    'access.premium.feature3': 'Early access chapters',
    'access.premium.feature4': 'Support creators',
    'access.support': 'Support creators',
    'access.support.desc': 'Your subscription directly helps compensate authors.',
    'access.secure': 'Secure payment',
    'access.secure.desc': 'Protected transactions and confidential data.',

    // Creators
    'creators.title': 'Content Creators',
    'creators.subtitle': 'The platform that values Malagasy authors',
    'creators.publish.title': 'Publish your stories',
    'creators.publish.desc': 'Share your tales with an audience passionate about Malagasy culture.',
    'creators.earn.title': 'Generate revenue',
    'creators.earn.desc': 'Every read of your stories earns you money. The more you\'re read, the more you earn.',
    'creators.community.title': 'Engaged community',
    'creators.community.desc': 'Join a fair and transparent platform that puts creators first.',
    'creators.cta': 'Become a creator',

    // CTA
    'cta.title': 'Ready to discover the mysteries of Madagascar?',
    'cta.subtitle': 'Download APPISTERY and dive into true stories that will thrill you.',
    'cta.button': 'Download Appistery',
    'cta.android': 'Available on Android',

    // Footer
    'footer.description': 'The streaming platform for true stories from Malagasy culture.',
    'footer.about': 'About',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    'footer.made': 'Made in Madagascar',
    'footer.rights': '© Appistery – All rights reserved',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appistery-language');
      if (saved === 'fr' || saved === 'en') return saved;
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem('appistery-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
