# 🚀 Travago - Plateforme de Placement de Personnel

**"Un clic tout emplois"**

Plateforme web moderne de mise en relation entre candidats et entreprises au Cameroun.

## 📋 Pages Créées

### ✅ Pages Publiques
- ✅ **Landing Page** (`/`) - Page d'accueil avec menu mobile responsive
  - Hero section avec recherche
  - Section "Comment ça marche" (4 étapes)
  - Section Candidats
  - Section Entreprises
  - Témoignages
  - Footer complet

### ✅ Pages d'Authentification
- ✅ **Sélection type d'inscription** (`/register`) - Choix entre Candidat et Entreprise
- ✅ **Connexion** (`/login`) - Formulaire de connexion
- ✅ **Inscription Candidat** (`/register/candidat`) - Formulaire complet
- ✅ **Inscription Entreprise** (`/register/entreprise`) - Formulaire complet

### ✅ Dashboards
- ✅ **Dashboard Candidat** (`/dashboard/candidat`)
  - Sidebar avec navigation
  - Statistiques (candidatures, favoris, vues profil, messages)
  - Barre de recherche d'offres
  - Candidatures récentes
  - Offres recommandées
  - Barre de progression du profil

- ✅ **Dashboard Entreprise** (`/dashboard/entreprise`)
  - Sidebar avec navigation
  - Statistiques avec tendances
  - Bouton création d'offre
  - Offres actives avec métriques
  - Candidatures récentes avec score de match
  - Placeholder graphique de performance

## 🎨 Design Features

### Responsive Design
- ✅ Menu hamburger mobile sur la landing page
- ✅ Grilles adaptatives (mobile, tablet, desktop)
- ✅ Sidebar collapsible sur mobile pour les dashboards
- ✅ Formulaires optimisés pour mobile

### Animations
- ✅ Framer Motion pour les transitions
- ✅ Hover effects sur les cartes
- ✅ Animations au scroll (fade in)
- ✅ Transitions fluides

### UI/UX
- ✅ Gradients modernes (bleu → cyan)
- ✅ Icônes Lucide React
- ✅ Formulaires avec validation visuelle
- ✅ Toggle visibilité mot de passe
- ✅ États de chargement et feedback visuel

## 🛠️ Stack Technique

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Dépendances Installées
```json
{
  "lucide-react": "^latest",
  "framer-motion": "^latest"
}
```

## 🚀 Démarrage

```bash
# Installation des dépendances
cd frontend
npm install

# Lancement du serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

## 📁 Structure du Projet

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       ├── candidat/
│   │       │   └── page.tsx
│   │       └── entreprise/
│   │           └── page.tsx
│   ├── dashboard/
│   │   ├── candidat/
│   │   │   └── page.tsx
│   │   └── entreprise/
│   │       └── page.tsx
│   ├── page.tsx (Landing)
│   ├── layout.tsx
│   └── globals.css
├── public/
│   └── logo.jpeg
└── package.json
```

## 🎯 Prochaines Étapes

### Backend (À créer)
- [ ] Initialiser Django avec DRF
- [ ] Créer les modèles (User, Candidat, Entreprise, JobOffer, etc.)
- [ ] Implémenter l'authentification JWT
- [ ] Créer les endpoints API
- [ ] Configurer PostgreSQL

### Frontend (À compléter)
- [ ] Intégration API backend
- [ ] Pages de profil (édition)
- [ ] Page liste des offres avec filtres
- [ ] Page détail d'une offre
- [ ] Système de messagerie
- [ ] Gestion des candidatures
- [ ] Upload de CV et documents
- [ ] Notifications en temps réel

### DevOps
- [ ] Configuration Docker
- [ ] CI/CD avec GitHub Actions
- [ ] Déploiement Vercel (frontend)
- [ ] Déploiement Railway (backend)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Palette de Couleurs

- **Primary Blue**: `#3b82f6` (blue-600)
- **Primary Cyan**: `#06b6d4` (cyan-600)
- **Success**: `#10b981` (green-600)
- **Warning**: `#f59e0b` (orange-600)
- **Error**: `#ef4444` (red-600)
- **Gray Scale**: gray-50 → gray-900

## 📄 Licence

© 2026 Travago. Tous droits réservés. Fait avec ❤️ au Cameroun.
