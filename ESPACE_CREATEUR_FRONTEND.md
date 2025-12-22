# Espace Créateur - Frontend

## 🎨 Pages créées

### Authentification
- **[CreatorLogin.tsx](src/pages/CreatorLogin.tsx)** - Connexion des créateurs
- **[CreatorRegister.tsx](src/pages/CreatorRegister.tsx)** - Inscription des créateurs

### Dashboard
- **[CreatorDashboard.tsx](src/pages/CreatorDashboard.tsx)** - Tableau de bord principal avec statistiques

## 🔧 Contexte et Services

### [AuthContext.tsx](src/contexts/AuthContext.tsx)
Gère l'authentification des créateurs :
- Login/Logout
- Stockage du token JWT
- État d'authentification
- Données de l'utilisateur

### [api.ts](src/lib/api.ts)
Service API avec Axios :
- Configuration de base
- Intercepteurs pour le token JWT
- Endpoints pour toutes les actions créateur

## 🛣️ Routes disponibles

```
/                       → Landing page
/creator/login          → Connexion créateur
/creator/register       → Inscription créateur
/creator/dashboard      → Dashboard créateur (protégé)
```

## 🔐 Fonctionnalités

### Authentification
- ✅ Formulaire de connexion avec validation
- ✅ Formulaire d'inscription complet
- ✅ Gestion sécurisée des mots de passe
- ✅ Stockage du token dans localStorage
- ✅ Redirection automatique après login/logout

### Dashboard Créateur
- ✅ Affichage des statistiques (histoires, vues, likes, abonnés)
- ✅ Gestion du profil
- ✅ Liste des histoires
- ✅ Navigation vers création d'histoire
- ✅ Déconnexion

### Sécurité
- ✅ Token JWT envoyé automatiquement dans les headers
- ✅ Redirection vers login si token invalide/expiré
- ✅ Routes protégées par authentification
- ✅ Validation des formulaires

## 🚀 Utilisation

### Démarrer le frontend
```bash
npm run dev
```

### Test de l'authentification

1. **Inscription** :
   - Aller sur `/creator/register`
   - Remplir le formulaire
   - Créer un compte

2. **Connexion** :
   - Aller sur `/creator/login`
   - Se connecter avec email/password
   - Redirection automatique vers `/creator/dashboard`

3. **Dashboard** :
   - Voir les statistiques
   - Gérer les histoires
   - Modifier le profil

## 🎯 Points d'accès

### Depuis la landing page
- Bouton "Espace Créateur" dans le header
- Lien dans le footer (à ajouter)

### Navigation directe
- URLs accessibles directement

## 📦 Dépendances installées

- **axios** : Client HTTP pour les appels API
- **react-router-dom** : Déjà présent pour la navigation

## 🔄 Flux d'authentification

```
1. Utilisateur remplit le formulaire login/register
2. Envoi vers backend API (http://localhost:5500)
3. Backend renvoie token JWT + données utilisateur
4. Frontend stocke token dans localStorage
5. Token ajouté automatiquement à chaque requête (intercepteur)
6. Si token expiré → redirection vers /creator/login
```

## 🎨 UI/UX

- Design cohérent avec le landing page
- Utilisation de shadcn/ui components
- Thème dark/light supporté
- Responsive design (mobile-first)
- Animations et transitions fluides

## 📝 À implémenter prochainement

- [ ] Page de création/édition d'histoires
- [ ] Page de paramètres utilisateur
- [ ] Upload d'avatar
- [ ] Graphiques d'analytics
- [ ] Gestion des chapitres
- [ ] Notifications
- [ ] Modification du mot de passe
- [ ] Prévisualisation des histoires

## 🔗 Connexion avec le Backend

Le frontend communique avec le backend sur `http://localhost:5500/api`

**Assurez-vous que le backend est démarré** :
```bash
cd ../appistery-backend-lunch
npm run dev
```

## 🐛 Debug

En cas de problème de CORS :
- Vérifier que le backend a `cors` activé
- Port backend : 5500
- Port frontend : 5173 (Vite par défaut)
