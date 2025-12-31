#!/bin/bash

# Script de déploiement pour Mistery Site (Frontend)
# Usage: ./deploy.sh

set -e  # Arrête le script en cas d'erreur

echo "================================================"
echo "🚀 Déploiement du Frontend (Mistery Site)"
echo "================================================"
echo ""

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Vérifier que nous sommes au bon endroit
if [ ! -f "package.json" ]; then
    log_error "package.json non trouvé. Assurez-vous d'être dans le répertoire mistery-site"
    exit 1
fi

# 1. Git Pull
log_info "Récupération des dernières modifications..."
git pull
log_success "Git pull terminé"
echo ""

# 2. Installer les dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances..."
    npm install
    log_success "Dépendances installées"
    echo ""
fi

# 3. Build
log_info "Construction du projet..."
npm run build
if [ $? -eq 0 ]; then
    log_success "Build terminé avec succès"
else
    log_error "Erreur lors du build"
    exit 1
fi
echo ""

# 4. PM2 Restart
log_info "Redémarrage via PM2..."
pm2 restart mistery-site

if [ $? -eq 0 ]; then
    log_success "Application redémarrée"
    echo ""
    log_info "Affichage du statut PM2:"
    pm2 status
else
    log_error "Erreur lors du redémarrage PM2"
    exit 1
fi

echo ""
echo "================================================"
echo -e "${GREEN}✓ Déploiement terminé avec succès!${NC}"
echo "================================================"
