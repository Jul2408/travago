# 🧭 Guide de Navigation - Travago

## Pages Accessibles

### 🏠 Pages Publiques
- **Accueil**: http://localhost:3000/
- **Connexion**: http://localhost:3000/login
- **Choix inscription**: http://localhost:3000/register
- **Inscription Candidat**: http://localhost:3000/register/candidat
- **Inscription Entreprise**: http://localhost:3000/register/entreprise

### 👤 Dashboard Candidat
- **Tableau de bord**: http://localhost:3000/dashboard/candidat

### 🏢 Dashboard Entreprise
- **Tableau de bord**: http://localhost:3000/dashboard/entreprise

## 🎯 Test du Menu Mobile

Pour tester le menu hamburger mobile :
1. Ouvrez http://localhost:3000/
2. Réduisez la fenêtre du navigateur (< 768px)
3. Cliquez sur l'icône menu (☰) en haut à droite
4. Le menu devrait s'ouvrir avec animation

## ✅ Checklist de Test

### Landing Page
- [ ] Menu desktop visible sur grand écran
- [ ] Menu mobile (hamburger) visible sur petit écran
- [ ] Hero section responsive
- [ ] Barre de recherche adaptative
- [ ] Statistiques en grille 2x2 sur mobile, 4 colonnes sur desktop
- [ ] Section "Comment ça marche" en grille responsive
- [ ] Sections Candidats/Entreprises empilées sur mobile
- [ ] Témoignages en grille responsive
- [ ] Footer en grille responsive

### Pages d'Authentification
- [ ] Formulaire de connexion centré et responsive
- [ ] Toggle visibilité mot de passe fonctionne
- [ ] Formulaire inscription candidat responsive
- [ ] Formulaire inscription entreprise responsive
- [ ] Sélecteurs de ville fonctionnels
- [ ] Validation des champs

### Dashboards
- [ ] Sidebar visible sur desktop
- [ ] Sidebar cachée sur mobile (bouton hamburger)
- [ ] Stats en grille responsive
- [ ] Cartes de contenu adaptatives
- [ ] Navigation fonctionnelle

## 🎨 Points de Rupture Responsive

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 768px (md)
- **Desktop**: > 768px (lg)

## 🐛 Problèmes Connus

Aucun pour le moment. Si vous rencontrez des problèmes :
1. Vérifiez que le serveur dev tourne (`npm run dev`)
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs

## 📝 Notes

- Les formulaires ne sont pas encore connectés au backend (TODO)
- Les données des dashboards sont mockées (données de test)
- Les liens de navigation internes fonctionnent
- Les animations sont activées par défaut
