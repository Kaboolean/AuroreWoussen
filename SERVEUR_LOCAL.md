# Comment lancer un serveur local

## Problème

Le système de routing utilise `fetch()` pour charger les pages dynamiquement. Pour des raisons de sécurité, `fetch()` ne fonctionne **pas** avec le protocole `file://` (quand vous ouvrez directement `index.html` dans le navigateur).

## Solution : Utiliser un serveur HTTP local

Vous devez servir le site via un serveur HTTP local. Voici plusieurs méthodes :

### Méthode 1 : Avec npm (recommandé)

Si vous avez Node.js installé, utilisez la commande npm :

```bash
npm run serve
```

Ou directement :

```bash
npx serve . -l 3000
```

Puis ouvrez votre navigateur sur : `http://localhost:3000`

### Méthode 2 : Avec Python

Si vous avez Python installé :

**Python 3 :**
```bash
python -m http.server 3000
```

**Python 2 :**
```bash
python -m SimpleHTTPServer 3000
```

Puis ouvrez votre navigateur sur : `http://localhost:3000`

### Méthode 3 : Avec PHP

Si vous avez PHP installé :

```bash
php -S localhost:3000
```

Puis ouvrez votre navigateur sur : `http://localhost:3000`

### Méthode 4 : Avec Live Server (VS Code)

Si vous utilisez VS Code, installez l'extension "Live Server" et cliquez sur "Go Live" dans la barre d'état.

## Vérification

Une fois le serveur lancé, vous devriez pouvoir :
- Voir la page d'accueil se charger automatiquement
- Naviguer entre les pages sans erreur
- Voir les URLs changer dans la barre d'adresse

## Note importante

Pour la production, vous devrez configurer votre serveur web (Apache, Nginx, etc.) pour qu'il serve correctement les fichiers statiques. Le système de routing fonctionnera parfaitement une fois déployé sur un serveur HTTP.

