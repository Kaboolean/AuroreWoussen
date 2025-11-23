# Système de Routing - Documentation

## Vue d'ensemble

Le site utilise un système de routing côté client (SPA - Single Page Application) qui permet de charger dynamiquement le contenu de chaque page sans recharger complètement la page. Cela permet de :

- Séparer le contenu de chaque page dans des fichiers distincts
- Maintenir le header et footer communs
- Améliorer l'expérience utilisateur avec des transitions fluides
- Faciliter la maintenance du code

## Structure des fichiers

```
/
├── index.html          # Page principale avec header, footer et conteneur dynamique
├── js/
│   ├── router.js      # Système de routing
│   └── main.js        # Scripts généraux (menu mobile, etc.)
├── pages/             # Templates HTML de chaque page
│   ├── home.html
│   ├── presentation.html
│   ├── protheses-mammaires.html
│   └── ...
└── css/
    └── main.css       # Styles compilés
```

## Comment ajouter une nouvelle page

### 1. Créer le fichier HTML de la page

Créez un nouveau fichier dans le dossier `pages/` avec le nom de votre page (en minuscules, avec des tirets).

Exemple : `pages/ma-nouvelle-page.html`

```html
<!-- Page Ma nouvelle page -->
<section class="page-content">
    <div class="container">
        <h1 class="page-title">Titre de la page</h1>
        
        <div class="content-section">
            <p>Votre contenu ici...</p>
        </div>
    </div>
</section>
```

### 2. Enregistrer la route dans router.js

Ouvrez `js/router.js` et ajoutez la route dans la section `DOMContentLoaded` :

```javascript
router.register('ma-nouvelle-page', 'pages/ma-nouvelle-page.html');
```

### 3. Ajouter le lien dans la navigation

Dans `index.html`, ajoutez un lien avec l'attribut `data-page` :

```html
<a href="/ma-nouvelle-page" data-page="ma-nouvelle-page" class="nav__link">Ma nouvelle page</a>
```

## Utilisation des liens

Pour créer un lien vers une page interne, utilisez l'attribut `data-page` :

```html
<a href="/nom-de-la-page" data-page="nom-de-la-page">Lien vers la page</a>
```

Le router intercepte automatiquement ces liens et charge le contenu sans recharger la page.

## Routes disponibles

Les routes suivantes sont déjà configurées :

- `home` - Page d'accueil
- `presentation` - Présentation du Dr Woussen
- `protheses-mammaires` - Prothèses mammaires
- `reduction-mammaire` - Réduction mammaire
- `lifting-mammaire` - Lifting mammaire
- `lipofilling-mammaire` - Lipofilling mammaire
- `mamelons-ombiliques` - Mamelons ombiliqués
- `gynecomastie` - Gynécomastie
- `lipoaspiration` - Lipoaspiration
- `abdominoplastie` - Abdominoplastie
- `body-lift` - Body lift
- `mommy-makeover` - Mommy Makeover
- `brachioplastie` - Brachioplastie
- `cruroplastie` - Cruroplastie
- `lifting-cervico-facial` - Lifting cervico facial
- `blepharoplastie` - Blépharoplastie
- `oreilles-decollees` - Oreilles décollées
- `avant-apres` - Avant / Après
- `tarifs` - Tarifs
- `contact` - Contact
- `mentions-legales` - Mentions légales

## Fonctionnalités

### Navigation automatique

Le router gère automatiquement :
- Les clics sur les liens avec `data-page`
- Le bouton retour/avant du navigateur
- La mise à jour de l'URL dans la barre d'adresse
- Le scroll vers le haut lors du changement de page

### Gestion des erreurs

Si une page n'existe pas, le router redirige automatiquement vers la page d'accueil.

### Événements personnalisés

Un événement `pageChanged` est déclenché à chaque changement de page. Vous pouvez l'écouter pour exécuter du code spécifique :

```javascript
window.addEventListener('pageChanged', (e) => {
    console.log('Page changée :', e.detail.page);
    // Votre code ici
});
```

## Notes importantes

1. **Chemins relatifs** : Les chemins des images dans les pages doivent être relatifs à la racine du site (ex: `images/logo.png`)

2. **Styles** : Les styles communs sont dans `scss/_pages.scss`. Vous pouvez ajouter des styles spécifiques à une page si nécessaire.

3. **SEO** : Pour un meilleur référencement, vous pourriez vouloir créer des fichiers HTML statiques séparés en production. Le système actuel fonctionne bien pour le développement et les sites de taille moyenne.

4. **Compatibilité** : Le système utilise l'API Fetch et l'API History, compatibles avec tous les navigateurs modernes.

## Dépannage

### La page ne se charge pas

1. Vérifiez que le fichier existe dans `pages/`
2. Vérifiez que la route est enregistrée dans `router.js`
3. Vérifiez la console du navigateur pour les erreurs

### Les liens ne fonctionnent pas

1. Assurez-vous que les liens ont l'attribut `data-page`
2. Vérifiez que `router.js` est chargé avant `main.js` dans `index.html`

### Le contenu ne s'affiche pas correctement

1. Vérifiez que les styles CSS sont compilés (`npm run sass`)
2. Vérifiez que la structure HTML de la page est correcte

