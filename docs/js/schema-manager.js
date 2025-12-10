/**
 * Schema Manager - Gestion des données structurées JSON-LD dynamiques
 * pour le site Dr. Aurore Woussen
 */
class SchemaManager {
    constructor() {
        this.baseUrl = 'https://docteur-aurore-woussen.fr';
        this.schemaContainer = null;
        this.init();
    }

    init() {
        // Créer un conteneur pour les schémas dynamiques
        this.schemaContainer = document.createElement('div');
        this.schemaContainer.id = 'dynamic-schemas';
        document.head.appendChild(this.schemaContainer);

        // Écouter les changements de page
        window.addEventListener('pageChanged', (e) => {
            this.updateSchemas(e.detail.page);
        });

        // Gérer la page initiale
        this.updateSchemas(this.getCurrentPage());
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            return 'home';
        }
        return path.replace(/^\//, '').replace(/\.html$/, '');
    }

    injectSchema(schema, id) {
        // Supprimer le schéma existant avec le même ID
        const existing = document.getElementById(id);
        if (existing) {
            existing.remove();
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(schema);
        this.schemaContainer.appendChild(script);
    }

    clearPageSchemas() {
        const pageSchemas = this.schemaContainer.querySelectorAll('[id^="schema-page-"]');
        pageSchemas.forEach(schema => schema.remove());
    }

    updateSchemas(page) {
        this.clearPageSchemas();

        // Injecter le breadcrumb
        const breadcrumb = this.getBreadcrumbSchema(page);
        this.injectSchema(breadcrumb, 'schema-page-breadcrumb');

        // Injecter le schéma spécifique à la page
        const pageSchema = this.getPageSchema(page);
        if (pageSchema) {
            this.injectSchema(pageSchema, 'schema-page-content');
        }
    }

    getBreadcrumbSchema(page) {
        const breadcrumbs = this.buildBreadcrumbs(page);
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };
    }

    buildBreadcrumbs(page) {
        const breadcrumbs = [
            { name: "Accueil", url: this.baseUrl + "/" }
        ];

        const hierarchy = this.getPageHierarchy();
        const pageInfo = hierarchy[page];

        if (pageInfo && page !== 'home') {
            if (pageInfo.parent) {
                breadcrumbs.push({
                    name: pageInfo.parentName,
                    url: this.baseUrl + "/" + pageInfo.parent
                });
            }
            breadcrumbs.push({
                name: pageInfo.name,
                url: this.baseUrl + "/" + page
            });
        }

        return breadcrumbs;
    }

    getPageHierarchy() {
        return {
            'home': { name: 'Accueil' },
            'presentation': { name: 'Dr Aurore Woussen' },
            'articles': { name: 'Articles' },
            'mon-cabinet': { name: 'Mon cabinet' },
            'tarifs': { name: 'Tarifs' },
            'avant-apres': { name: 'Avant / Après' },
            'parcours-chirurgie': { name: 'Parcours de chirurgie' },
            'mentions-legales': { name: 'Mentions légales' },

            // Chirurgie du sein
            'protheses-mammaires': { name: 'Prothèses mammaires', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },
            'reduction-mammaire': { name: 'Réduction mammaire', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },
            'lifting-mammaire': { name: 'Lifting mammaire', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },
            'lipofilling-mammaire': { name: 'Lipofilling mammaire', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },
            'mamelons-ombiliques': { name: 'Mamelons ombiliqués', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },
            'gynecomastie': { name: 'Gynécomastie', parent: 'chirurgie-sein', parentName: 'Chirurgie du sein' },

            // Chirurgie de la silhouette
            'lipoaspiration': { name: 'Lipoaspiration', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },
            'abdominoplastie': { name: 'Abdominoplastie', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },
            'body-lift': { name: 'Body lift', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },
            'mommy-makeover': { name: 'Mommy Makeover', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },
            'brachioplastie': { name: 'Brachioplastie', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },
            'cruroplastie': { name: 'Cruroplastie', parent: 'chirurgie-silhouette', parentName: 'Chirurgie de la silhouette' },

            // Chirurgie du visage
            'lifting-cervico-facial': { name: 'Lifting cervico-facial', parent: 'chirurgie-visage', parentName: 'Chirurgie du visage' },
            'blepharoplastie': { name: 'Blépharoplastie', parent: 'chirurgie-visage', parentName: 'Chirurgie du visage' },
            'oreilles-decollees': { name: 'Oreilles décollées', parent: 'chirurgie-visage', parentName: 'Chirurgie du visage' }
        };
    }

    getPageSchema(page) {
        const procedures = {
            'protheses-mammaires': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Augmentation mammaire par prothèses",
                "alternateName": ["Prothèses mammaires", "Implants mammaires"],
                "description": "Intervention chirurgicale permettant d'augmenter le volume des seins par la pose d'implants mammaires.",
                "procedureType": "Surgical",
                "bodyLocation": "Poitrine",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'reduction-mammaire': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Réduction mammaire",
                "description": "Intervention chirurgicale visant à réduire le volume des seins hypertrophiés.",
                "procedureType": "Surgical",
                "bodyLocation": "Poitrine",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'lifting-mammaire': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Lifting mammaire",
                "alternateName": ["Mastopexie"],
                "description": "Intervention chirurgicale corrigeant l'affaissement des seins (ptose).",
                "procedureType": "Surgical",
                "bodyLocation": "Poitrine",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'lipofilling-mammaire': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Lipofilling mammaire",
                "description": "Augmentation mammaire naturelle par injection de graisse autologue.",
                "procedureType": "Surgical",
                "bodyLocation": "Poitrine",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'mamelons-ombiliques': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Correction des mamelons ombiliqués",
                "description": "Intervention corrigeant les mamelons invaginés.",
                "procedureType": "Surgical",
                "bodyLocation": "Mamelons",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'gynecomastie': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Traitement de la gynécomastie",
                "description": "Correction chirurgicale de l'excès mammaire chez l'homme.",
                "procedureType": "Surgical",
                "bodyLocation": "Poitrine masculine",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'lipoaspiration': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Lipoaspiration",
                "alternateName": ["Liposuccion"],
                "description": "Élimination des amas graisseux localisés par aspiration.",
                "procedureType": "Surgical",
                "bodyLocation": "Corps",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'abdominoplastie': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Abdominoplastie",
                "alternateName": ["Plastie abdominale"],
                "description": "Intervention retendant la peau et les muscles de l'abdomen.",
                "procedureType": "Surgical",
                "bodyLocation": "Abdomen",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'body-lift': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Body lift",
                "alternateName": ["Lifting circulaire"],
                "description": "Correction du relâchement cutané du tronc après amaigrissement.",
                "procedureType": "Surgical",
                "bodyLocation": "Tronc",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'mommy-makeover': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Mommy Makeover",
                "description": "Combinaison de chirurgies pour restaurer le corps après grossesse.",
                "procedureType": "Surgical",
                "bodyLocation": "Corps",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'brachioplastie': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Brachioplastie",
                "alternateName": ["Lifting des bras"],
                "description": "Correction de l'excès de peau et graisse des bras.",
                "procedureType": "Surgical",
                "bodyLocation": "Bras",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'cruroplastie': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Cruroplastie",
                "alternateName": ["Lifting des cuisses"],
                "description": "Correction du relâchement cutané des cuisses.",
                "procedureType": "Surgical",
                "bodyLocation": "Cuisses",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'lifting-cervico-facial': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Lifting cervico-facial",
                "description": "Rajeunissement du visage et du cou par correction de l'affaissement.",
                "procedureType": "Surgical",
                "bodyLocation": "Visage et cou",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'blepharoplastie': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Blépharoplastie",
                "alternateName": ["Chirurgie des paupières"],
                "description": "Correction de l'excès de peau et des poches des paupières.",
                "procedureType": "Surgical",
                "bodyLocation": "Paupières",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            },
            'oreilles-decollees': {
                "@context": "https://schema.org",
                "@type": "MedicalProcedure",
                "name": "Otoplastie",
                "alternateName": ["Correction des oreilles décollées"],
                "description": "Correction chirurgicale des oreilles décollées.",
                "procedureType": "Surgical",
                "bodyLocation": "Oreilles",
                "performedBy": { "@id": "https://docteur-aurore-woussen.fr/#organization" }
            }
        };

        return procedures[page] || null;
    }
}

// Initialiser le SchemaManager au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.schemaManager = new SchemaManager();
});
