/**
 * Gestion des carrousels avant/après
 * Défilement automatique toutes les 3 secondes
 */
class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-btn--prev');
        this.nextBtn = container.querySelector('.carousel-btn--next');
        this.indicatorsContainer = document.querySelector(`.carousel-indicators[data-carousel="${container.dataset.carousel}"]`);
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 3000; // 3 secondes
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        // Créer les indicateurs
        this.createIndicators();
        
        // Écouter les clics sur les boutons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Plus besoin d'écouter les clics sur les indicateurs (on utilise juste le compteur)
        
        // Pause au survol
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.play());
        
        // Pause au focus (accessibilité)
        this.container.addEventListener('focusin', () => this.pause());
        this.container.addEventListener('focusout', () => this.play());
        
        // Gérer les erreurs de chargement d'images
        this.handleImageErrors();
        
        // Gérer le redimensionnement de la fenêtre
        this.handleResize = () => {
            this.updateCarousel();
        };
        window.addEventListener('resize', this.handleResize);
        
        // Attendre que les images soient chargées pour initialiser
        this.waitForImages().then(() => {
            this.updateCarousel();
            this.play();
        });
    }
    
    waitForImages() {
        return Promise.all(
            Array.from(this.slides).map(slide => {
                const img = slide.querySelector('img');
                if (img && !img.complete) {
                    return new Promise((resolve) => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    });
                }
                return Promise.resolve();
            })
        );
    }
    
    handleImageErrors() {
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('error', () => {
                    console.warn(`Image non chargée: ${img.src}`);
                    // Essayer avec un chemin encodé
                    const originalSrc = img.src;
                    try {
                        const url = new URL(originalSrc, window.location.origin);
                        const pathParts = url.pathname.split('/');
                        const fileName = pathParts[pathParts.length - 1];
                        const encodedFileName = encodeURIComponent(fileName);
                        pathParts[pathParts.length - 1] = encodedFileName;
                        url.pathname = pathParts.join('/');
                        img.src = url.toString();
                    } catch (e) {
                        console.error('Erreur lors de l\'encodage du chemin:', e);
                    }
                });
            }
        });
    }
    
    createIndicators() {
        // Plus besoin d'indicateurs
        if (this.indicatorsContainer) {
            this.indicatorsContainer.style.display = 'none';
        }
    }
    
    updateCarousel() {
        // Utiliser les pourcentages pour un déplacement plus fiable
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoPlay();
        }
    }
    
    play() {
        this.pause(); // S'assurer qu'il n'y a pas d'intervalle en double
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }
    
    pause() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.pause();
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
    }
    
    resetAutoPlay() {
        this.pause();
        this.play();
    }
}

// Stocker les instances de carrousels pour éviter les doublons
const carouselInstances = new WeakMap();

// Initialiser les carrousels quand la page est chargée
function initCarousels() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        // Vérifier si un carrousel existe déjà pour ce conteneur
        if (!carouselInstances.has(container)) {
            const carousel = new Carousel(container);
            carouselInstances.set(container, carousel);
        }
    });
}

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}

// Réinitialiser les carrousels quand une nouvelle page est chargée (pour le router)
window.addEventListener('pageChanged', () => {
    // Petit délai pour s'assurer que le HTML est inséré
    setTimeout(initCarousels, 100);
});

