// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Fermer le menu mobile au clic sur un lien de navigation
    function closeMobileMenu() {
        if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            // Fermer aussi les dropdowns
            const dropdowns = document.querySelectorAll('.nav__dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = '';
            });
        }
    }

    // Ajouter l'écouteur sur tous les liens du header (sauf les parents de dropdown)
    document.querySelectorAll('.nav__list a[data-page]').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Ajouter l'écouteur sur les liens des sous-menus
    document.querySelectorAll('.nav__submenu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer le menu mobile en cliquant en dehors du header
    document.addEventListener('click', function(event) {
        const header = document.querySelector('.header');
        const isMobile = window.innerWidth <= 992;
        
        if (isMobile && navList && navList.classList.contains('active')) {
            // Si le clic est en dehors du header, fermer le menu
            if (!header.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Gestion des dropdowns uniquement pour mobile (pas pour desktop hover)
    let dropdownHandlersInitialized = false;
    
    function handleDropdowns() {
        const isMobile = window.innerWidth <= 992;
        
        if (isMobile && !dropdownHandlersInitialized) {
            const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
            
            dropdownItems.forEach(item => {
                const link = item.querySelector('.nav__link');
                const dropdown = item.querySelector('.nav__dropdown');
                
                if (link && dropdown) {
                    // En mobile, rediriger vers la page chirurgies au lieu d'ouvrir le dropdown
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 992) {
                            e.preventDefault();
                            // Fermer le menu mobile
                            closeMobileMenu();
                            // Naviguer vers la page chirurgies
                            if (window.router) {
                                window.router.navigate('chirurgies');
                            } else {
                                window.location.href = '/chirurgies';
                            }
                        }
                    });
                }
            });
            
            dropdownHandlersInitialized = true;
        } else if (!isMobile) {
            // Sur desktop, on laisse le CSS gérer le hover
            dropdownHandlersInitialized = false;
        }
    }
    
    // Initialiser et gérer le redimensionnement
    handleDropdowns();
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            dropdownHandlersInitialized = false;
            handleDropdowns();
        }, 250);
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
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
                    
                    // Close mobile menu if open
                    if (navList && navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        if (navToggle) {
                            navToggle.classList.remove('active');
                        }
                    }
                }
            }
        });
    });
    
    // Gestion des boutons de tarifs
    function initTarifsButtons() {
        const buttons = document.querySelectorAll('.tarifs-button');
        const cards = document.querySelectorAll('.tarifs-card-content');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTarif = this.getAttribute('data-tarif');
                
                // Retirer la classe active de tous les boutons
                buttons.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                // Masquer toutes les cards
                cards.forEach(card => {
                    card.style.display = 'none';
                });
                
                // Afficher la card correspondante
                const targetCard = document.querySelector(`[data-card="${targetTarif}"]`);
                if (targetCard) {
                    targetCard.style.display = 'block';
                }
            });
        });
    }
    
    // Gestion des onglets de tarifs (ancien système, conservé pour compatibilité)
    function initTarifsTabs() {
        const tabs = document.querySelectorAll('.tarifs-tabs__tab');
        const contents = document.querySelectorAll('.tarifs-tabs__content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Retirer la classe active de tous les onglets
                tabs.forEach(t => t.classList.remove('active'));
                // Ajouter la classe active à l'onglet cliqué
                this.classList.add('active');
                
                // Masquer tous les contenus
                contents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Afficher le contenu correspondant
                const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    // Gestion des articles
    function initArticles() {
        const articleItems = document.querySelectorAll('.articles-page__item');
        const articleContents = document.querySelectorAll('.articles-page__article-content');

        articleItems.forEach(item => {
            item.addEventListener('click', function() {
                const targetArticle = this.getAttribute('data-article');

                // Retirer la classe active de tous les items
                articleItems.forEach(i => i.classList.remove('articles-page__item--active'));
                // Ajouter la classe active à l'item cliqué
                this.classList.add('articles-page__item--active');

                // Masquer tous les contenus d'articles
                articleContents.forEach(content => {
                    content.style.display = 'none';
                });

                // Afficher l'article correspondant
                const targetContent = document.querySelector(`.articles-page__article-content[data-article="${targetArticle}"]`);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }

    // Initialiser les boutons et onglets si la page tarifs est chargée
    initTarifsButtons();
    initTarifsTabs();
    initArticles();

    // Réinitialiser les boutons et onglets après un changement de page (pour le router)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const tarifsButtons = document.querySelector('.tarifs-buttons');
                const tarifsTabs = document.querySelector('.tarifs-tabs');
                const articlesPage = document.querySelector('.articles-page');
                if (tarifsButtons) {
                    initTarifsButtons();
                }
                if (tarifsTabs) {
                    initTarifsTabs();
                }
                if (articlesPage) {
                    initArticles();
                }
            }
        });
    });
    
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        observer.observe(pageContent, {
            childList: true,
            subtree: true
        });
    }
});

