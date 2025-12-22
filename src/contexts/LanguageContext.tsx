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
    'hero.subtitle': 'Découvrez des histoires vraies issues de la culture malgache. Mystère, paranormal, drames — vivez des vécus authentiques en streaming.',
    'hero.cta': 'Télécharger l\'application',
    'hero.badge': 'Disponible sur Android',

    // Concept
    'concept.title': 'Le streaming d\'histoires vraies',
    'concept.subtitle': 'APPISTERY réinvente la façon de vivre les vécus authentiques',
    'concept.streaming.title': 'Streaming immersif',
    'concept.streaming.desc': 'Des histoires vraies en streaming, organisées en séries et épisodes pour une expérience de lecture captivante.',
    'concept.culture.title': 'Culture malgache',
    'concept.culture.desc': 'Des vécus issus de la richesse culturelle, sociale et mystique de Madagascar.',
    'concept.series.title': 'Séries & Épisodes',
    'concept.series.desc': 'Chaque histoire est structurée en chapitres pour vous tenir en haleine.',
    'concept.mobile.title': 'Lecture mobile',
    'concept.mobile.desc': 'Une expérience optimisée pour votre smartphone, lisez où que vous soyez.',

    // Featured Stories
    'stories.title': 'Histoires en vedette',
    'stories.subtitle': 'Explorez nos vécus les plus captivants',
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
    'features.streaming.desc': 'Accédez à des vécus authentiques basés sur des faits réels de Madagascar.',
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
    'creators.publish.desc': 'Partagez vos vécus avec une audience passionnée par la culture malgache.',
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

    // Creator Space
    'creator.login.title': 'Espace Créateur',
    'creator.login.subtitle': 'Connectez-vous pour gérer vos histoires',
    'creator.login.email': 'Email',
    'creator.login.password': 'Mot de passe',
    'creator.login.show': 'Afficher',
    'creator.login.hide': 'Masquer',
    'creator.login.button': 'Se connecter',
    'creator.login.loading': 'Connexion...',
    'creator.login.noAccount': 'Pas encore de compte ?',
    'creator.login.register': 'S\'inscrire',
    'creator.login.backHome': 'Retour à l\'accueil',
    'creator.login.error': 'Erreur de connexion',

    'creator.register.title': 'Devenir Créateur',
    'creator.register.subtitle': 'Rejoignez notre communauté de créateurs',
    'creator.register.email': 'Email',
    'creator.register.password': 'Mot de passe',
    'creator.register.confirmPassword': 'Confirmer le mot de passe',
    'creator.register.phone': 'Numéro de téléphone',
    'creator.register.biography': 'Biographie',
    'creator.register.biographyPlaceholder': 'Parlez-nous de vous et de votre passion pour l\'écriture...',
    'creator.register.speciality': 'Spécialité',
    'creator.register.specialityPlaceholder': 'Ex: Mystère, Paranormal, Drame...',
    'creator.register.button': 'Créer mon compte',
    'creator.register.loading': 'Inscription...',
    'creator.register.hasAccount': 'Déjà un compte ?',
    'creator.register.login': 'Se connecter',
    'creator.register.backHome': 'Retour à l\'accueil',
    'creator.register.passwordMismatch': 'Les mots de passe ne correspondent pas',
    'creator.register.passwordTooShort': 'Le mot de passe doit contenir au moins 8 caractères',
    'creator.register.error': 'Erreur lors de l\'inscription',

    'creator.dashboard.welcome': 'Bienvenue',
    'creator.dashboard.title': 'Tableau de bord',
    'creator.dashboard.menu.dashboard': 'Tableau de bord',
    'creator.dashboard.menu.stories': 'Mes histoires',
    'creator.dashboard.menu.analytics': 'Statistiques',
    'creator.dashboard.menu.notifications': 'Notifications',
    'creator.dashboard.menu.settings': 'Paramètres',
    'creator.dashboard.logout': 'Déconnexion',
    'creator.dashboard.newStory': 'Nouvelle histoire',

    'creator.dashboard.stats.totalStories': 'Histoires totales',
    'creator.dashboard.stats.totalViews': 'Vues totales',
    'creator.dashboard.stats.totalReactions': 'Réactions',
    'creator.dashboard.stats.followers': 'Abonnés',

    'creator.dashboard.recent.title': 'Histoires récentes',
    'creator.dashboard.recent.empty': 'Aucune histoire pour le moment',
    'creator.dashboard.recent.createFirst': 'Créez votre première histoire pour commencer',
    'creator.dashboard.recent.views': 'vues',
    'creator.dashboard.recent.status.published': 'Publié',
    'creator.dashboard.recent.status.draft': 'Brouillon',

    'creator.dashboard.performance.title': 'Aperçu des performances',
    'creator.dashboard.performance.week': 'Cette semaine',
    'creator.dashboard.performance.month': 'Ce mois',
    'creator.dashboard.performance.growth': 'Croissance',

    'creator.settings.title': 'Paramètres',
    'creator.settings.language': 'Langue',
    'creator.settings.languageDescription': 'Choisissez la langue de l\'interface',
    'creator.settings.theme': 'Thème',
    'creator.settings.themeDescription': 'Gérez l\'apparence de votre espace créateur',
    'creator.settings.theme.light': 'Clair',
    'creator.settings.theme.lightDesc': 'Thème lumineux',
    'creator.settings.theme.dark': 'Sombre',
    'creator.settings.theme.darkDesc': 'Thème sombre',
    'creator.settings.theme.system': 'Système',
    'creator.settings.theme.systemDesc': 'Suit votre système',
    'creator.settings.account': 'Informations du compte',
    'creator.settings.email': 'Email',
    'creator.settings.speciality': 'Spécialité',
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

    // Creator Space
    'creator.login.title': 'Creator Space',
    'creator.login.subtitle': 'Log in to manage your stories',
    'creator.login.email': 'Email',
    'creator.login.password': 'Password',
    'creator.login.show': 'Show',
    'creator.login.hide': 'Hide',
    'creator.login.button': 'Log in',
    'creator.login.loading': 'Logging in...',
    'creator.login.noAccount': 'Don\'t have an account?',
    'creator.login.register': 'Sign up',
    'creator.login.backHome': 'Back to home',
    'creator.login.error': 'Login error',

    'creator.register.title': 'Become a Creator',
    'creator.register.subtitle': 'Join our community of creators',
    'creator.register.email': 'Email',
    'creator.register.password': 'Password',
    'creator.register.confirmPassword': 'Confirm password',
    'creator.register.phone': 'Phone number',
    'creator.register.biography': 'Biography',
    'creator.register.biographyPlaceholder': 'Tell us about yourself and your passion for writing...',
    'creator.register.speciality': 'Speciality',
    'creator.register.specialityPlaceholder': 'E.g: Mystery, Paranormal, Drama...',
    'creator.register.button': 'Create my account',
    'creator.register.loading': 'Signing up...',
    'creator.register.hasAccount': 'Already have an account?',
    'creator.register.login': 'Log in',
    'creator.register.backHome': 'Back to home',
    'creator.register.passwordMismatch': 'Passwords do not match',
    'creator.register.passwordTooShort': 'Password must be at least 8 characters',
    'creator.register.error': 'Registration error',

    'creator.dashboard.welcome': 'Welcome',
    'creator.dashboard.title': 'Dashboard',
    'creator.dashboard.menu.dashboard': 'Dashboard',
    'creator.dashboard.menu.stories': 'My stories',
    'creator.dashboard.menu.analytics': 'Analytics',
    'creator.dashboard.menu.notifications': 'Notifications',
    'creator.dashboard.menu.settings': 'Settings',
    'creator.dashboard.logout': 'Logout',
    'creator.dashboard.newStory': 'New story',

    'creator.dashboard.stats.totalStories': 'Total stories',
    'creator.dashboard.stats.totalViews': 'Total views',
    'creator.dashboard.stats.totalReactions': 'Reactions',
    'creator.dashboard.stats.followers': 'Followers',

    'creator.dashboard.recent.title': 'Recent stories',
    'creator.dashboard.recent.empty': 'No stories yet',
    'creator.dashboard.recent.createFirst': 'Create your first story to get started',
    'creator.dashboard.recent.views': 'views',
    'creator.dashboard.recent.status.published': 'Published',
    'creator.dashboard.recent.status.draft': 'Draft',

    'creator.dashboard.performance.title': 'Performance overview',
    'creator.dashboard.performance.week': 'This week',
    'creator.dashboard.performance.month': 'This month',
    'creator.dashboard.performance.growth': 'Growth',

    'creator.settings.title': 'Settings',
    'creator.settings.language': 'Language',
    'creator.settings.languageDescription': 'Choose your interface language',
    'creator.settings.theme': 'Theme',
    'creator.settings.themeDescription': 'Manage your creator space appearance',
    'creator.settings.theme.light': 'Light',
    'creator.settings.theme.lightDesc': 'Light theme',
    'creator.settings.theme.dark': 'Dark',
    'creator.settings.theme.darkDesc': 'Dark theme',
    'creator.settings.theme.system': 'System',
    'creator.settings.theme.systemDesc': 'Follow your system',
    'creator.settings.account': 'Account information',
    'creator.settings.email': 'Email',
    'creator.settings.speciality': 'Speciality',
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
