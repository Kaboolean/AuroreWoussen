# Guide de déploiement OVH

## Fichiers à transférer sur le serveur OVH

### Structure sur le serveur OVH
```
www/ (ou public_html/)
├── index.html
├── .htaccess
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

## Étapes de déploiement

### 1. Compiler le SCSS pour la production
```bash
npm run build
```
Cela génère un fichier CSS minifié optimisé pour la production.

### 2. Transférer les fichiers via FTP/SFTP

**Fichiers essentiels à transférer :**
- ✅ `index.html`
- ✅ `css/main.css` (fichier compilé)
- ✅ `js/main.js`
- ✅ `images/presentation/` (dossier complet avec les 3 images)
- ✅ `.htaccess` (optionnel mais recommandé)

**Fichiers à NE PAS transférer :**
- ❌ `scss/` (fichiers sources)
- ❌ `node_modules/`
- ❌ `package.json`
- ❌ `README.md`
- ❌ `DEPLOIEMENT.md`

### 3. Vérifier les permissions

Sur le serveur OVH, assurez-vous que :
- Les fichiers ont les permissions **644**
- Les dossiers ont les permissions **755**

### 4. Tester le site

Une fois les fichiers transférés :
1. Accédez à votre domaine
2. Vérifiez que le site s'affiche correctement
3. Testez la navigation mobile
4. Vérifiez que les images s'affichent

## Configuration DNS (si nécessaire)

Si vous utilisez un nouveau domaine ou sous-domaine :
1. Connectez-vous à votre espace client OVH
2. Allez dans la section DNS
3. Configurez les enregistrements A ou CNAME selon vos besoins

## Support

En cas de problème :
- Vérifiez les logs d'erreur du serveur
- Assurez-vous que tous les fichiers sont bien transférés
- Vérifiez les chemins relatifs dans le HTML

