/**
 * Configuration SEO pour le site Dr. Aurore Woussen
 * Contient les titres, descriptions et images pour chaque page
 */
const SEO_CONFIG = {
    baseUrl: 'https://docteur-aurore-woussen.fr',
    defaultImage: 'https://docteur-aurore-woussen.fr/images/presentation/AurorePresentation1.jpg',
    siteName: 'Dr. Aurore Woussen - Chirurgie Plastique',
    locale: 'fr_FR',

    pages: {
        'home': {
            title: 'Dr. Aurore Woussen | Chirurgien Plasticien Dunkerque',
            description: 'Dr. Aurore Woussen, chirurgien plasticien qualifiée à Dunkerque. Chirurgie esthétique du sein, de la silhouette et du visage. Consultations à la Clinique Villette.'
        },
        'presentation': {
            title: 'Dr. Aurore Woussen | Parcours et Diplômes | Chirurgien Plasticien',
            description: 'Découvrez le parcours du Dr Aurore Woussen, chirurgien plasticien diplômée. Formation au CHRU de Besançon, spécialisation en chirurgie du sein et reconstruction mammaire.'
        },
        'articles': {
            title: 'Articles | Actualités Chirurgie Esthétique | Dr. Woussen Dunkerque',
            description: 'Articles et conseils sur la chirurgie esthétique par le Dr. Aurore Woussen. Informations patients, nouveautés et actualités en chirurgie plastique.'
        },
        'parcours-chirurgie': {
            title: 'Parcours de Chirurgie | De la Consultation à l\'Opération | Dr. Woussen',
            description: 'Découvrez les étapes du parcours chirurgical : consultation, devis, intervention et suivi post-opératoire avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'protheses-mammaires': {
            title: 'Prothèses Mammaires Dunkerque | Augmentation Mammaire | Dr. Woussen',
            description: 'Augmentation mammaire par prothèses avec le Dr Aurore Woussen à Dunkerque. Implants en silicone, voies d\'abord et suites opératoires. Consultation personnalisée.'
        },
        'reduction-mammaire': {
            title: 'Réduction Mammaire Dunkerque | Hypertrophie Mammaire | Dr. Woussen',
            description: 'Réduction mammaire pour hypertrophie avec le Dr Aurore Woussen. Intervention chirurgicale pour réduire le volume des seins à Dunkerque.'
        },
        'lifting-mammaire': {
            title: 'Lifting Mammaire Dunkerque | Ptose Mammaire | Dr. Woussen',
            description: 'Lifting mammaire (mastopexie) pour corriger la ptose. Remonter et remodeler la poitrine avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'lipofilling-mammaire': {
            title: 'Lipofilling Mammaire Dunkerque | Augmentation Naturelle | Dr. Woussen',
            description: 'Lipofilling mammaire : augmentation des seins par injection de graisse autologue. Résultat naturel avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'mamelons-ombiliques': {
            title: 'Mamelons Ombiliqués | Correction Chirurgicale | Dr. Woussen Dunkerque',
            description: 'Correction des mamelons ombiliqués (invaginés) par intervention chirurgicale simple avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'gynecomastie': {
            title: 'Gynécomastie Dunkerque | Chirurgie Homme | Dr. Woussen',
            description: 'Traitement chirurgical de la gynécomastie (excès mammaire chez l\'homme) avec le Dr. Aurore Woussen, chirurgien plasticien à Dunkerque.'
        },
        'lipoaspiration': {
            title: 'Lipoaspiration Dunkerque | Liposuccion | Dr. Woussen',
            description: 'Lipoaspiration pour éliminer les amas graisseux localisés : ventre, cuisses, hanches. Dr. Aurore Woussen à Dunkerque.'
        },
        'abdominoplastie': {
            title: 'Abdominoplastie Dunkerque | Plastie Abdominale | Dr. Woussen',
            description: 'Abdominoplastie pour retendre la peau du ventre et réparer les muscles après grossesse ou perte de poids. Dr. Woussen Dunkerque.'
        },
        'body-lift': {
            title: 'Body Lift Dunkerque | Lifting Circulaire | Dr. Woussen',
            description: 'Body lift (dermolipectomie circulaire) après amaigrissement massif avec le Dr. Aurore Woussen, chirurgien plasticien à Dunkerque.'
        },
        'mommy-makeover': {
            title: 'Mommy Makeover Dunkerque | Chirurgie Post-Grossesse | Dr. Woussen',
            description: 'Mommy Makeover : combinaison de chirurgies pour retrouver son corps après grossesse avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'brachioplastie': {
            title: 'Brachioplastie Dunkerque | Lifting des Bras | Dr. Woussen',
            description: 'Brachioplastie pour corriger le relâchement cutané des bras avec le Dr. Aurore Woussen, chirurgien plasticien à Dunkerque.'
        },
        'cruroplastie': {
            title: 'Cruroplastie Dunkerque | Lifting des Cuisses | Dr. Woussen',
            description: 'Cruroplastie pour retendre la peau des cuisses après perte de poids avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'lifting-cervico-facial': {
            title: 'Lifting Cervico-Facial Dunkerque | Rajeunissement Visage | Dr. Woussen',
            description: 'Lifting cervico-facial pour rajeunir le visage et le cou. Correction des rides et du relâchement avec le Dr. Woussen Dunkerque.'
        },
        'blepharoplastie': {
            title: 'Blépharoplastie Dunkerque | Chirurgie des Paupières | Dr. Woussen',
            description: 'Blépharoplastie supérieure et inférieure. Correction des paupières tombantes et des poches avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'oreilles-decollees': {
            title: 'Oreilles Décollées Dunkerque | Otoplastie | Dr. Woussen',
            description: 'Otoplastie pour corriger les oreilles décollées. Intervention possible dès 7 ans avec le Dr. Aurore Woussen à Dunkerque.'
        },
        'avant-apres': {
            title: 'Photos Avant/Après | Résultats Chirurgie | Dr. Woussen Dunkerque',
            description: 'Galerie de photos avant/après des interventions de chirurgie esthétique. Résultats réels des patients du Dr. Aurore Woussen.'
        },
        'tarifs': {
            title: 'Tarifs Chirurgie Esthétique Dunkerque | Dr. Woussen',
            description: 'Consultez les tarifs des interventions de chirurgie esthétique du Dr. Aurore Woussen à la Clinique Villette, Dunkerque.'
        },
        'mon-cabinet': {
            title: 'Mon Cabinet | Dr. Woussen | Clinique Villette Dunkerque',
            description: 'Découvrez le cabinet du Dr. Aurore Woussen à la Clinique Villette, 18 rue Parmentier, Dunkerque. Tél: 03 28 23 77 24. Prise de RDV sur Doctolib.'
        },
        'mentions-legales': {
            title: 'Mentions Légales | Dr. Aurore Woussen',
            description: 'Mentions légales du site docteur-aurore-woussen.fr. Informations sur l\'éditeur et l\'hébergeur du site.'
        },
        'chirurgies': {
            title: 'Interventions Chirurgicales | Chirurgie Esthétique | Dr. Woussen Dunkerque',
            description: 'Découvrez toutes les interventions de chirurgie esthétique proposées par le Dr. Aurore Woussen : chirurgie du sein, de la silhouette et du visage à Dunkerque.'
        }
    }
};

// Exposer la configuration globalement
window.SEO_CONFIG = SEO_CONFIG;
