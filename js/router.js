/**
 * Router simple pour charger dynamiquement le contenu des pages
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.contentContainer = document.getElementById('page-content');
        // Détecter le base path pour GitHub Pages ou autres hébergements en sous-dossier
        this.basePath = this.detectBasePath();
        console.log('Router initialisé avec basePath:', this.basePath);
    }

    /**
     * Détecte le chemin de base du site (pour GitHub Pages, etc.)
     * @returns {string} Le chemin de base (ex: '/AuroreWoussen' ou '')
     */
    detectBasePath() {
        // Vérifier si on a déjà stocké le basePath (pour éviter de le perdre après navigation)
        const storedBasePath = sessionStorage.getItem('router_basePath');
        if (storedBasePath !== null) {
            return storedBasePath;
        }

        let basePath = '';

        // Pour GitHub Pages: détecter automatiquement le nom du repo
        if (window.location.hostname.includes('github.io')) {
            // L'URL est de la forme: username.github.io/repo-name/...
            // On extrait /repo-name
            const pathParts = window.location.pathname.split('/').filter(p => p);
            if (pathParts.length > 0) {
                // Le premier segment est le nom du repo
                basePath = '/' + pathParts[0];
            }
        } else {
            // Chercher une balise <base> dans le HTML
            const baseTag = document.querySelector('base');
            if (baseTag) {
                const href = baseTag.getAttribute('href');
                if (href && href !== '/') {
                    try {
                        const url = new URL(href, window.location.origin);
                        basePath = url.pathname.replace(/\/$/, '');
                    } catch (e) {
                        basePath = href.replace(/\/$/, '');
                    }
                }
            }
        }

        // Stocker le basePath pour les navigations futures
        sessionStorage.setItem('router_basePath', basePath);
        return basePath;
    }

    /**
     * Initialise le router (doit être appelé après l'enregistrement des routes)
     */
    init() {
        // Écouter les changements d'URL (clic sur les liens, bouton retour, etc.)
        window.addEventListener('popstate', (e) => {
            this.handleRoute();
        });

        // Intercepter les clics sur les liens internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                const href = link.getAttribute('href');
                const dataPage = link.getAttribute('data-page');

                // Si le lien a data-page, utiliser cette valeur
                if (dataPage) {
                    e.preventDefault();
                    this.navigate(dataPage);
                    return;
                }

                // Sinon, vérifier si c'est un lien interne vers une route enregistrée
                if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('http')) {
                    const page = href.replace(/^\//, '').replace(/\.html$/, '') || 'home';
                    if (this.routes[page] || page === 'home') {
                        e.preventDefault();
                        this.navigate(page);
                    }
                }
            }
        });

        // Gérer la redirection depuis 404.html (GitHub Pages SPA hack)
        this.handleSPARedirect();

        // Charger la page initiale
        this.handleRoute();
    }

    /**
     * Gère la redirection depuis 404.html pour GitHub Pages
     */
    handleSPARedirect() {
        // Vérifier si on a été redirigé depuis 404.html
        const redirectPath = sessionStorage.getItem('redirect_path');
        if (redirectPath) {
            sessionStorage.removeItem('redirect_path');
            // Nettoyer l'URL (enlever le query string utilisé pour la redirection)
            const cleanUrl = this.basePath + redirectPath;
            window.history.replaceState(null, '', cleanUrl);
        }
    }

    /**
     * Enregistre une route
     * @param {string} path - Le chemin de la route
     * @param {string} templatePath - Le chemin vers le template HTML
     */
    register(path, templatePath) {
        this.routes[path] = templatePath;
    }

    /**
     * Navigue vers une page
     * @param {string} path - Le chemin de la page
     */
    navigate(path) {
        // Mettre à jour l'URL sans recharger la page
        let url;
        if (path === 'home') {
            url = this.basePath ? this.basePath + '/' : '/';
        } else {
            url = this.basePath ? `${this.basePath}/${path}` : `/${path}`;
        }
        console.log('Navigation vers:', path, '| URL:', url);
        window.history.pushState({ page: path }, '', url);
        this.loadPage(path);
    }

    /**
     * Gère le routing basé sur l'URL actuelle
     */
    handleRoute() {
        let path = window.location.pathname;
        let page = 'home';

        console.log('handleRoute - pathname:', path, '| basePath:', this.basePath);

        // Enlever le base path si présent
        if (this.basePath && path.startsWith(this.basePath)) {
            path = path.slice(this.basePath.length);
        }

        // Normaliser le path
        if (!path || path === '/' || path === '/index.html') {
            page = 'home';
        } else {
            // Extraire le nom de la page depuis l'URL
            // Ex: /protheses-mammaires -> protheses-mammaires
            page = path.replace(/^\//, '').replace(/\.html$/, '');
        }

        console.log('handleRoute - page détectée:', page);
        this.loadPage(page);
    }

    /**
     * Charge le contenu d'une page
     * @param {string} page - Le nom de la page à charger
     */
    async loadPage(page) {
        // Si la page n'existe pas, rediriger vers la page d'accueil
        if (!this.routes[page]) {
            // Si l'URL n'est pas déjà la racine, rediriger proprement vers l'accueil
            const homeUrl = this.basePath ? this.basePath + '/' : '/';
            if (window.location.pathname !== homeUrl && window.location.pathname !== this.basePath + '/index.html') {
                console.log('Route inconnue:', page, '- Redirection vers accueil');
                window.history.replaceState(null, '', homeUrl);
            }
            page = 'home';
        }

        // Si c'est déjà la page actuelle, ne rien faire
        if (this.currentPage === page) {
            return;
        }

        this.currentPage = page;
        const templatePath = this.routes[page] || this.routes['home'];

        try {
            // Afficher un indicateur de chargement
            if (this.contentContainer) {
                this.contentContainer.style.opacity = '0.5';
            }

            // Vérifier si on est en mode file:// (fichiers locaux)
            const isFileProtocol = window.location.protocol === 'file:';
            
            if (isFileProtocol) {
                console.warn('Mode file:// détecté. fetch() ne fonctionne pas avec file://. Utilisez un serveur local.');
                throw new Error('Le site doit être servi via un serveur HTTP (pas file://). Utilisez un serveur local comme "python -m http.server" ou "npx serve".');
            }

            // Charger le template (ajouter le base path pour GitHub Pages)
            const fullPath = this.basePath ? `${this.basePath}/${templatePath}` : templatePath;
            console.log('loadPage - Chargement de:', fullPath);
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} - Fichier: ${templatePath}`);
            }

            const html = await response.text();

            // Insérer le contenu
            if (this.contentContainer) {
                this.contentContainer.innerHTML = html;
                this.contentContainer.style.opacity = '1';

                // Déclencher un événement personnalisé pour indiquer que la page a changé
                window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page } }));

                // Scroll vers le haut
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Mettre à jour les meta tags SEO
                this.updateMetaTags(page);

                // Mettre à jour la navigation latérale entre pages de même catégorie
                this.updatePageNavigation(page);

                // Réinitialiser les scripts si nécessaire
                this.initPageScripts();
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la page:', error);
            console.error('Page demandée:', page);
            console.error('Chemin du template:', templatePath);
            console.error('Routes disponibles:', Object.keys(this.routes));
            
            if (this.contentContainer) {
                const errorMessage = error.message || 'Erreur inconnue';
                this.contentContainer.innerHTML = `
                    <div class="container" style="padding: 2rem; text-align: center;">
                        <h2>Erreur de chargement</h2>
                        <p><strong>Impossible de charger cette page.</strong></p>
                        <p style="color: #666; font-size: 0.9em; margin: 1rem 0;">${errorMessage}</p>
                        <p style="color: #666; font-size: 0.9em; margin: 1rem 0;">
                            Page: <code>${page}</code><br>
                            Fichier: <code>${templatePath}</code>
                        </p>
                        <p style="margin-top: 2rem;">
                            <a href="/" data-page="home" class="btn btn--primary">Retour à l'accueil</a>
                        </p>
                        <details style="margin-top: 2rem; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                            <summary style="cursor: pointer; color: #666;">Détails techniques (cliquez pour voir)</summary>
                            <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; margin-top: 1rem; font-size: 0.8em;">${error.stack || error.toString()}</pre>
                        </details>
                    </div>
                `;
            }
        }
    }

    /**
     * Réinitialise les scripts spécifiques à la page
     */
    initPageScripts() {
        // Réinitialiser le smooth scroll pour les ancres
        const anchorLinks = document.querySelectorAll('#page-content a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    /**
     * Met à jour les meta tags SEO pour la page courante
     * @param {string} page - Le nom de la page
     */
    updateMetaTags(page) {
        if (!window.SEO_CONFIG) return;

        const config = window.SEO_CONFIG.pages[page] || window.SEO_CONFIG.pages['home'];
        const baseUrl = window.SEO_CONFIG.baseUrl;
        const defaultImage = window.SEO_CONFIG.defaultImage;
        const siteName = window.SEO_CONFIG.siteName;

        if (!config) return;

        const url = page === 'home' ? baseUrl + '/' : baseUrl + '/' + page;

        // Mettre à jour le title
        document.title = config.title;

        // Mettre à jour la meta description
        this.setMetaContent('name', 'description', config.description);

        // Mettre à jour le canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', url);
        }

        // Mettre à jour les Open Graph tags
        this.setMetaContent('property', 'og:title', config.title);
        this.setMetaContent('property', 'og:description', config.description);
        this.setMetaContent('property', 'og:url', url);
        this.setMetaContent('property', 'og:image', config.image || defaultImage);

        // Mettre à jour les Twitter Card tags
        this.setMetaContent('name', 'twitter:title', config.title);
        this.setMetaContent('name', 'twitter:description', config.description);
        this.setMetaContent('name', 'twitter:image', config.image || defaultImage);
    }

    /**
     * Met à jour le contenu d'une meta tag
     * @param {string} attr - L'attribut à chercher (name ou property)
     * @param {string} name - La valeur de l'attribut
     * @param {string} content - Le nouveau contenu
     */
    setMetaContent(attr, name, content) {
        const meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (meta && content) {
            meta.setAttribute('content', content);
        }
    }

    /**
     * Met à jour la navigation latérale entre pages de même catégorie
     * @param {string} page - Le nom de la page actuelle
     */
    updatePageNavigation(page) {
        // Définir les catégories de pages
        const categories = {
            sein: [
                'protheses-mammaires',
                'reduction-mammaire',
                'lifting-mammaire',
                'lipofilling-mammaire',
                'mamelons-ombiliques',
                'gynecomastie'
            ],
            silhouette: [
                'lipoaspiration',
                'abdominoplastie',
                'body-lift',
                'mommy-makeover',
                'brachioplastie',
                'cruroplastie'
            ],
            visage: [
                'lifting-cervico-facial',
                'blepharoplastie',
                'oreilles-decollees'
            ]
        };

        // Trouver la catégorie de la page actuelle
        let currentCategory = null;
        let currentIndex = -1;

        for (const [category, pages] of Object.entries(categories)) {
            const index = pages.indexOf(page);
            if (index !== -1) {
                currentCategory = category;
                currentIndex = index;
                break;
            }
        }

        const prevNav = document.getElementById('page-nav-prev');
        const nextNav = document.getElementById('page-nav-next');

        // Si la page n'est pas dans une catégorie, cacher la navigation
        if (!currentCategory) {
            if (prevNav) prevNav.style.display = 'none';
            if (nextNav) nextNav.style.display = 'none';
            this.removeMobileNavigation();
            return;
        }

        const pagesInCategory = categories[currentCategory];
        const prevPage = currentIndex > 0 ? pagesInCategory[currentIndex - 1] : null;
        const nextPage = currentIndex < pagesInCategory.length - 1 ? pagesInCategory[currentIndex + 1] : null;

        // Configurer le bouton précédent (desktop)
        if (prevNav) {
            if (prevPage) {
                prevNav.style.display = 'block';
                prevNav.onclick = () => this.navigate(prevPage);
                prevNav.querySelector('button').setAttribute('title', this.getPageTitle(prevPage));
            } else {
                prevNav.style.display = 'none';
            }
        }

        // Configurer le bouton suivant (desktop)
        if (nextNav) {
            if (nextPage) {
                nextNav.style.display = 'block';
                nextNav.onclick = () => this.navigate(nextPage);
                nextNav.querySelector('button').setAttribute('title', this.getPageTitle(nextPage));
            } else {
                nextNav.style.display = 'none';
            }
        }

        // Ajouter la navigation mobile en bas du contenu
        this.addMobileNavigation(prevPage, nextPage);
    }

    /**
     * Ajoute la navigation mobile en bas du contenu de la page
     * @param {string|null} prevPage - Page précédente
     * @param {string|null} nextPage - Page suivante
     */
    addMobileNavigation(prevPage, nextPage) {
        // Supprimer l'ancienne navigation mobile si elle existe
        this.removeMobileNavigation();

        // Créer la navigation mobile
        const mobileNav = document.createElement('div');
        mobileNav.className = 'page-nav-mobile';
        mobileNav.id = 'page-nav-mobile';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-nav-mobile__btn' + (prevPage ? '' : ' page-nav-mobile__btn--hidden');
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            ${prevPage ? this.getPageTitle(prevPage) : ''}
        `;
        if (prevPage) {
            prevBtn.onclick = () => this.navigate(prevPage);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-nav-mobile__btn' + (nextPage ? '' : ' page-nav-mobile__btn--hidden');
        nextBtn.innerHTML = `
            ${nextPage ? this.getPageTitle(nextPage) : ''}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
        `;
        if (nextPage) {
            nextBtn.onclick = () => this.navigate(nextPage);
        }

        mobileNav.appendChild(prevBtn);
        mobileNav.appendChild(nextBtn);

        // Ajouter au conteneur de la page
        const container = this.contentContainer.querySelector('.container');
        if (container) {
            container.appendChild(mobileNav);
        } else {
            this.contentContainer.appendChild(mobileNav);
        }
    }

    /**
     * Supprime la navigation mobile
     */
    removeMobileNavigation() {
        const existingNav = document.getElementById('page-nav-mobile');
        if (existingNav) {
            existingNav.remove();
        }
    }

    /**
     * Retourne le titre lisible d'une page
     * @param {string} page - Le nom de la page
     * @returns {string} Le titre de la page
     */
    getPageTitle(page) {
        const titles = {
            'protheses-mammaires': 'Prothèses mammaires',
            'reduction-mammaire': 'Réduction mammaire',
            'lifting-mammaire': 'Lifting mammaire',
            'lipofilling-mammaire': 'Lipofilling mammaire',
            'mamelons-ombiliques': 'Mamelons ombiliqués',
            'gynecomastie': 'Gynécomastie',
            'lipoaspiration': 'Lipoaspiration',
            'abdominoplastie': 'Abdominoplastie',
            'body-lift': 'Body lift',
            'mommy-makeover': 'Mommy Makeover',
            'brachioplastie': 'Brachioplastie',
            'cruroplastie': 'Cruroplastie',
            'lifting-cervico-facial': 'Lifting cervico-facial',
            'blepharoplastie': 'Blépharoplastie',
            'oreilles-decollees': 'Oreilles décollées'
        };
        return titles[page] || page;
    }
}

// Initialiser le router quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const router = new Router();

    // Enregistrer les routes
    router.register('home', 'pages/home.html');
    router.register('presentation', 'pages/presentation.html');
    router.register('protheses-mammaires', 'pages/protheses-mammaires.html');
    router.register('reduction-mammaire', 'pages/reduction-mammaire.html');
    router.register('lifting-mammaire', 'pages/lifting-mammaire.html');
    router.register('lipofilling-mammaire', 'pages/lipofilling-mammaire.html');
    router.register('mamelons-ombiliques', 'pages/mamelons-ombiliques.html');
    router.register('gynecomastie', 'pages/gynecomastie.html');
    router.register('lipoaspiration', 'pages/lipoaspiration.html');
    router.register('abdominoplastie', 'pages/abdominoplastie.html');
    router.register('body-lift', 'pages/body-lift.html');
    router.register('mommy-makeover', 'pages/mommy-makeover.html');
    router.register('brachioplastie', 'pages/brachioplastie.html');
    router.register('cruroplastie', 'pages/cruroplastie.html');
    router.register('lifting-cervico-facial', 'pages/lifting-cervico-facial.html');
    router.register('blepharoplastie', 'pages/blepharoplastie.html');
    router.register('oreilles-decollees', 'pages/oreilles-decollees.html');
    router.register('avant-apres', 'pages/avant-apres.html');
    router.register('tarifs', 'pages/tarifs.html');
    router.register('parcours-chirurgie', 'pages/parcours-chirurgie.html');
    router.register('mon-cabinet', 'pages/mon-cabinet.html');
    router.register('mentions-legales', 'pages/mentions-legales.html');
    router.register('articles', 'pages/articles.html');
    router.register('chirurgies', 'pages/chirurgies.html');

    // Initialiser le router après l'enregistrement des routes
    router.init();

    // Exposer le router globalement pour un accès depuis d'autres scripts si nécessaire
    window.router = router;
});

