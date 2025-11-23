# Site Web - Dr. Aurore Woussen

Site web statique du Dr. Aurore Woussen, Chirurgien Plasticien à Dunkerque.

## Structure du projet

```
.
├── index.html          # Page principale
├── css/               # Fichiers CSS compilés
│   └── main.css
├── scss/              # Fichiers SCSS sources
│   ├── main.scss
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _hero.scss
│   ├── _presentation.scss
│   └── _utilities.scss
├── js/                # Fichiers JavaScript
│   └── main.js
├── images/            # Images du site
│   └── presentation/
└── package.json       # Configuration npm
```

## Développement local

### Prérequis
- Node.js et npm installés

### Installation
```bash
npm install
```

### Compilation SCSS
```bash
# Compilation unique
npm run sass

# Compilation en mode watch (surveillance des changements)
npm run sass:watch

# Compilation pour production (minifié)
npm run build
```

## Déploiement sur OVH

### Méthode 1 : FTP/SFTP
1. Compiler le SCSS pour la production :
   ```bash
   npm run build
   ```

2. Transférer les fichiers suivants sur votre serveur OVH :
   - `index.html`
   - `css/main.css`
   - `js/main.js`
   - `images/` (dossier complet)

3. Structure recommandée sur le serveur :
   ```
   www/
   ├── index.html
   ├── css/
   │   └── main.css
   ├── js/
   │   └── main.js
   └── images/
       └── presentation/
           ├── AurorePresentation1.jpg
           ├── AurorePresentation2.jpg
           └── AurorePresentation3.jpg
   ```

### Méthode 2 : Git (si disponible)
1. Créer un dépôt Git
2. Configurer le déploiement automatique sur OVH
3. Le serveur compilera automatiquement lors du push

### Configuration serveur OVH

Le site est prêt à être déployé. Assurez-vous que :
- Le serveur supporte les fichiers statiques HTML/CSS/JS
- Les chemins relatifs sont corrects
- Les permissions des fichiers sont correctes (644 pour les fichiers, 755 pour les dossiers)

### Fichiers à ne PAS déployer
- `node_modules/`
- `scss/` (sources, déjà compilées en CSS)
- `package.json` (optionnel, seulement si vous voulez compiler sur le serveur)
- `.git/` (si vous utilisez Git)

## Notes

- Les fichiers SCSS sont compilés en CSS avant le déploiement
- Le site est responsive et optimisé pour mobile
- Tous les chemins sont relatifs pour faciliter le déploiement

