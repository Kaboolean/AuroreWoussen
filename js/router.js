/**
 * Router simple pour charger dynamiquement le contenu des pages
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.contentContainer = document.getElementById('page-content');
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

        // Charger la page initiale
        this.handleRoute();
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
        window.history.pushState({ page: path }, '', path === 'home' ? '/' : `/${path}`);
        this.loadPage(path);
    }

    /**
     * Gère le routing basé sur l'URL actuelle
     */
    handleRoute() {
        const path = window.location.pathname;
        let page = 'home';

        if (path !== '/' && path !== '/index.html') {
            // Extraire le nom de la page depuis l'URL
            // Ex: /protheses-mammaires -> protheses-mammaires
            page = path.replace(/^\//, '').replace(/\.html$/, '');
        }

        this.loadPage(page);
    }

    /**
     * Charge le contenu d'une page
     * @param {string} page - Le nom de la page à charger
     */
    async loadPage(page) {
        // Si la page n'existe pas, charger la page d'accueil
        if (!this.routes[page]) {
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

            // Charger le template
            const response = await fetch(templatePath);
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

    // Initialiser le router après l'enregistrement des routes
    router.init();

    // Exposer le router globalement pour un accès depuis d'autres scripts si nécessaire
    window.router = router;
});

