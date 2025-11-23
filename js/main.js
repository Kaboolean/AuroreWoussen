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
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        // Fermer les autres dropdowns
                        dropdownItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                const otherDropdown = otherItem.querySelector('.nav__dropdown');
                                if (otherDropdown) {
                                    otherDropdown.style.display = 'none';
                                }
                            }
                        });
                        // Toggle le dropdown actuel
                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                    });
                }
            });
            
            // Fermer les dropdowns en cliquant en dehors (mobile uniquement)
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.nav__item--dropdown')) {
                    const dropdowns = document.querySelectorAll('.nav__dropdown');
                    dropdowns.forEach(dropdown => {
                        dropdown.style.display = 'none';
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
});

