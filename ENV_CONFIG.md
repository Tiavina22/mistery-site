# Environment Variables - Frontend

## Configuration

Le frontend utilise un fichier `.env` unique pour configurer l'URL de l'API.

### Fichier de configuration

- **`.env`** - Configuration unique pour tous les environnements

### Variables disponibles

```env
VITE_API_URL=http://localhost:5500/api
```

> ⚠️ **Important** : Dans Vite, toutes les variables d'environnement exposées au client doivent commencer par `VITE_`

## Utilisation

Les variables sont accessibles via `import.meta.env.VITE_*` :

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Fichiers mis à jour

1. **[api.ts](src/lib/api.ts)** - Utilise `VITE_API_URL`
2. **[AuthContext.tsx](src/contexts/AuthContext.tsx)** - Utilise `VITE_API_URL`

## Démarrage

```bash
npm run dev
# Utilise .env
# API: http://localhost:5500/api
```

## Sécurité

- ✅ Le fichier `.env.local` est dans `.gitignore`
- ✅ Ne jamais commiter de secrets dans le fichier `.env`
- ✅ Seules les variables `VITE_*` sont exposées au client
- ⚠️ Ne pas mettre de clés secrètes dans `VITE_*` (visible côté client)

## Configuration pour la production

Pour la production, modifier directement le fichier `.env` ou utiliser les variables d'environnement du serveur de déploiement :

```env
VITE_API_URL=https://api.appistery.mg/api
```
