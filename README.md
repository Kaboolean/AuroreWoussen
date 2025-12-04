# Site Web - Dr. Aurore Woussen

Site web du Dr. Aurore Woussen, Chirurgien Plasticien à Dunkerque.

## Structure du projet

```
.
├── index.html          # Page principale (SPA)
├── 404.html            # Page 404 (redirection SPA pour GitHub Pages)
├── css/                # Fichiers CSS compilés
├── scss/               # Fichiers SCSS sources
├── js/                 # JavaScript (router, carousel, etc.)
├── pages/              # Fragments HTML des pages
├── images/             # Images du site
└── package.json        # Configuration npm
```

## Développement local

### Prérequis
- Node.js et npm

### Installation
```bash
npm install
```

### Lancer le serveur de développement
Utiliser l'extension **Live Server** de VS Code :
1. Ouvrir `index.html`
2. Clic droit → "Open with Live Server"

### Compilation SCSS
```bash
# Compilation unique
npm run sass

# Mode watch
npm run sass:watch

# Production (minifié)
npm run sass:build
```

## Déploiement

Le site est hébergé sur **GitHub Pages** avec le nom de domaine chez **OVH**.

```bash
# Build complet
npm run build
```

Puis push sur la branche `main` pour déclencher le déploiement automatique.

## Architecture

Le site utilise une architecture **SPA** (Single Page Application) :
- `index.html` contient le header, footer et la structure principale
- Les pages sont des fragments HTML chargés dynamiquement via le router (`js/router.js`)
- Le fichier `404.html` redirige vers `index.html` pour supporter les URLs propres sur GitHub Pages
