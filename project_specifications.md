# Projet Travago - Plateforme de Placement de Personnel

## 1. 🎯 Vue d'ensemble du projet
Créer une application web full-stack professionnelle appelée **Travago**, spécialisée dans le placement de personnel et la mise en relation entre candidats et entreprises. L'application doit être moderne, sécurisée, évolutive et optimisée pour le SEO.

## 2. 📚 Stack Technique Complète

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: React Hook Form + Zod validation
- **Authentification client**: NextAuth.js v5
- **HTTP Client**: Axios avec intercepteurs
- **Icons**: Lucide React
- **Charts**: Recharts (pour analytics)

### Backend
- **Framework**: Django 5.0+ avec Django REST Framework
- **Language**: Python 3.11+
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database ORM**: Django ORM
- **API Documentation**: drf-spectacular (OpenAPI/Swagger)
- **Task Queue**: Celery + Redis
- **Caching**: Redis
- **File Storage**: Django-storages + Cloudflare R2
- **Email**: django-anymail + Resend
- **Security**: django-cors-headers, django-ratelimit

### Database & Infrastructure
- **Database**: PostgreSQL 15+ (Neon.tech serverless)
- **Cache/Queue**: Redis (Upstash)
- **File Storage**: Cloudflare R2
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway.app ou Render.com
- **Email Service**: Resend.com
- **Monitoring**: Sentry
- **Analytics**: Plausible Analytics

### DevOps & Outils
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Environment Management**: Docker + docker-compose (dev)
- **Testing**:
    - Backend: pytest, pytest-django
    - Frontend: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Black, Flake8
- **API Testing**: Postman/Insomnia collections

## 3. 👥 Système d'Utilisateurs

### Types d'utilisateurs
1.  **Candidats (Chercheurs d'emploi)**
    - Inscription avec email/mot de passe
    - Profil détaillé (CV, compétences, expérience)
    - Recherche et candidature aux offres
    - Suivi des candidatures
    - Messagerie avec entreprises
    - Alertes email pour nouvelles offres
2.  **Entreprises (Recruteurs)**
    - Inscription avec validation email
    - Profil entreprise (logo, description, secteur)
    - Publication d'offres de placement
    - Gestion des candidatures reçues
    - Messagerie avec candidats
    - Statistiques (vues, candidatures)
    - Accès multi-utilisateurs (administrateur entreprise + recruteurs)
3.  **Administrateurs (Super Admin)**
    - Dashboard complet
    - Modération des offres et profils
    - Gestion des utilisateurs
    - Statistiques globales de la plateforme
    - Gestion du contenu (blog, pages statiques)
    - Configuration système

### Modèle de données utilisateurs (Champs principaux)

#### Candidat
- user (OneToOne avec User Django)
- photo_profil
- titre_professionnel
- bio
- cv_file (PDF)
- competences (ManyToMany)
- niveau_experience
- salaire_souhaite
- disponibilite
- ville
- telephone
- linkedin_url
- portfolio_url
- date_creation
- derniere_activite

#### Entreprise
- user (OneToOne avec User Django)
- nom_entreprise
- logo
- secteur_activite
- taille_entreprise (enum: 1-10, 11-50, 51-200, etc.)
- description
- site_web
- adresse_complete
- ville
- pays
- telephone
- email_contact
- date_creation
- verified (boolean)
- recruteurs (ManyToMany vers User pour multi-comptes)

#### Administrateur
- user (OneToOne avec User Django)
- role (enum: super_admin, moderateur)
- permissions

## 4. 🔐 Système d'Authentification Complet

### Backend Django Endpoints
- `POST /api/auth/register/candidate/`: Inscription candidat
- `POST /api/auth/register/company/`: Inscription entreprise
- `POST /api/auth/login/`: Connexion
- `POST /api/auth/refresh/`: Renouvellement token
- `POST /api/auth/logout/`: Déconnexion
- `POST /api/auth/password-reset-request/`: Demande réinitialisation mot de passe
- `POST /api/auth/password-reset-confirm/`: Confirmation nouveau mot de passe
- `POST /api/auth/verify-email/{token}/`: Vérification email
- `GET /api/auth/me/`: Récupération profil utilisateur

### Sécurité
- **Mots de passe**: Hashés avec bcrypt
- **JWT**: Access token (15 min), Refresh token (7 jours)
- **Rate limiting**:
    - Login: 5 tentatives / 15 min par IP
    - Registration: 3 / heure par IP
    - API globale: 100 requêtes / minute par utilisateur
- **CORS**: Configuré strictement pour domaine frontend
- **HTTPS**: Obligatoire en production
- **CSP Headers**: Configurés
- **2FA**: Optionnel pour entreprises

## 5. 📊 Modèles de Données Complets

1.  **Offres d'Emploi (JobOffer)**: id, titre, slug, entreprise, description, missions, profil_recherche, type_contrat, niveau_experience, salaire_min/max, ville, pays, teletravail, competences_requises/souhaitees, dates, statut, meta_tags, stats, flags.
2.  **Candidatures (Application)**: id, candidat, offre, cv_file, lettre_motivation, documents, statut, dates, notes_recruteur, evaluation, messages_count.
3.  **Compétences (Skill)**: id, nom, slug, categorie, description, nombre_offres.
4.  **Secteurs d'Activité (Sector)**: nom, slug, description, icon, meta_tags, stats.
5.  **Messages (Message/Conversation)**: Conversation (candidat, entreprise, candidature), Message (expediteur, contenu, fichiers, date, lu).
6.  **Alertes Emploi (JobAlert)**: candidat, mot_cles, villes, types_contrat, competences, salaire, frequence, active.
7.  **Favoris (Favorite)**: candidat, offre, date_ajout.

## 6. 🔌 API REST Complète

### Groupes d'Endpoints
- **Candidats**: CRUD profil, upload CV/photo, dashboard "me" (applications, favorites, alerts).
- **Entreprises**: CRUD profil, upload logo, dashboard "me" (jobs, applications, stats, recruiters).
- **Offres d'Emploi**: Liste avec filtres, CRUD (entreprise), postuler, stats vues/candidatures.
- **Candidatures**: Liste, détails, changement statut, notes.
- **Messagerie**: Conversations, messages, marking as read.
- **Recherche**: Globale, suggestions, filtres.
- **Référentiel**: Skills, sectors, cities.
- **Admin**: Dashboard stats, users management, moderation jobs, reports.
- **Utilitaires**: Upload, sitemap, health, public stats.

## 7. 🎨 Pages Frontend (Next.js)

### Pages Publiques (SSG/SSR)
- `/`: Accueil (Hero, Recherche, Featured Jobs, Secteurs, Témoignages).
- `/offres`: Liste offres + filtres.
- `/offres/[slug]`: Détails offre.
- `/entreprises`: Liste entreprises.
- `/entreprises/[slug]`: Page entreprise.
- `/secteurs`, `/villes`, `/competences`: Pages de navigation et SEO.
- `/blog`, `/contact`, `/a-propos`, `/cgv`, etc.

### Pages Authentifiées (CSR)
- Auth: Login, Register, Password Reset.
- **Dashboard Candidat**: `/dashboard/candidat` (Profil, CV, Candidatures, Messages, Alertes, Favoris).
- **Dashboard Entreprise**: `/dashboard/entreprise` (Profil, Offres, Candidatures, Messages, Stats, Equipe).
- **Admin**: `/admin` (Users, Jobs, Entreprises, Signalements, Stats, Contenu).

### Design System
- **Couleurs**: Primary (Blue), Secondary (Green), Warning (Orange), Error (Red), Neutrals.
- **Composants (Shadcn/ui)**: Buttons, Inputs, Cards, Modals, Dropdowns, Tables, etc.
- **Layouts**: Main Layout, Dashboard Layout.
- **Responsive**: Mobile-first.

## 8. 🔍 SEO & Performance
- **Next.js**: Metadata API, dynamic tagging, sitemap dynamique.
- **Schema.org**: JobPosting schema.
- **Performance**: Image optimization, font loading, code splitting, PWA capabilities.

## 9. 📧 Notifications Email
- **Templates (Resend + React Email)**: Welcome, Email Verification, Password Reset, New Job Alert, Application Received, Status Update, New Message, etc.
- **Backend Setup**: django-anymail with Resend.

## 10. 🔔 Notifications In-App
- Modèle `Notification` (type, titre, message, lien, lu).
- Types: status change, new message, job alert, system.

## 11. 🤖 L'IA au cœur du système (Moteur de Placement)
Le projet se distingue par une intégration poussée de l'IA pour automatiser le recrutement :

- **Matching prédictif** : Score de compatibilité basé sur les compétences (40%), l'expérience (30%), la localisation (20%) et le salaire (10%).
- **Générateur de CV Intelligent** : Création en 1 clic de CV optimisés pour les systèmes ATS.
- **Centre de Tests IA** : Évaluations techniques, psychotechniques et comportementales générées dynamiquement.
- **Indice de Placabilité (Score de Fiabilité)** : Évaluation automatique de la crédibilité du profil basée sur la complétion et les tests.
- **Analyse Vidéo (Optionnel)** : Évaluation du ton et de la confiance via une vidéo de présentation.
- **Vérification Documentaire (OCR)** : Analyse automatique des pièces d'identité et diplômes pour détecter les fraudes.
- **Système Anti-Fake** : Algorithme de détection des faux profils et des incohérences de parcours.

## 12. 📊 Analytics
- **Entreprise**: Vues offres, candidatures, taux conversion, graphiques.
- **Admin**: KPIs globaux, utilisateurs actifs, growth.

## 13. 🔒 Sécurité Avancée
- Headers sécurité (SSL, HSTS, CSP, etc.).
- Rate Limiting (django-ratelimit).
- Validation fichiers (taille, extension, virus scan).

## 14. 🧪 Tests
- **Backend**: pytest (auth, jobs, matching).
- **Frontend**: Jest + React Testing Library (components, pages).

## 15. 🚀 Déploiement & DevOps
- **Structure**: Monorepo-style (frontend/backend folders).
- **Docker**: Development compose file.
- **CI/CD**: GitHub Actions (deploy frontend Vercel, deploy backend Railway).
- **Env Vars**: Management for dev/prod.
- **PWA**: next-pwa configuration.

## 16. 📅 Roadmap
- **Phase 1 (MVP - S1-4)**: Setup, Auth, Core Features (Jobs, Profils, Applications), Pages Publiques de base.
- **Phase 2 (Avancée - S5-6)**: Messagerie, Alertes, Favoris, Matching, Blog.
- **Phase 3 (Polish - S7-8)**: Design final, PWA, Monitoring, Launch.
- **Phase 4**: Post-launch optimizations.

## 17. 💰 Coûts & Scale
- **MVP**: ~6$/mois (Railway db).
- **Scale**: Upgrades progressifs (Neon, Vercel Pro, Resend Pro, etc.).

## 18. 📋 Checklist Pré-Launch
- Technique (Tests, Build, Env vars, Security headers, Rate limit).
- SEO (Meta, Schema, Sitemap).
- Content (Legal, About, Initial Jobs/Blog).
- UX (Responsive, Forms, Loading states).
- Legal (GDPR, CGU/CGV).

---
*Ce document sert de référence vivante pour le développement du projet Travago.*
