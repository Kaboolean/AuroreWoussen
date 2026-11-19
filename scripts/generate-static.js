/**
 * Script de génération de pages HTML statiques pour le SEO
 * Génère des fichiers HTML pré-rendus pour chaque route du site
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://docteur-aurore-woussen.fr';
const SRC_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '..', 'docs');

// Configuration SEO pour chaque page
const SEO_CONFIG = {
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
        description: 'Augmentation mammaire par prothèses avec le Dr Aurore Woussen à Dunkerque. Implants en silicone, voies d\'abord et suites opératoires.'
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
        description: 'Découvrez le cabinet du Dr. Aurore Woussen à la Clinique Villette, 18 rue Parmentier, Dunkerque. Tél: 03 28 24 44 84. Prise de RDV sur Doctolib.'
    },
    'mentions-legales': {
        title: 'Mentions Légales | Dr. Aurore Woussen',
        description: 'Mentions légales du site docteur-aurore-woussen.fr. Informations sur l\'éditeur et l\'hébergeur du site.'
    }
};

// Liste des pages à générer
const pages = [
    { route: 'home', file: 'home.html', output: 'index.html' },
    { route: 'presentation', file: 'presentation.html', output: 'presentation/index.html' },
    { route: 'articles', file: 'articles.html', output: 'articles/index.html' },
    { route: 'parcours-chirurgie', file: 'parcours-chirurgie.html', output: 'parcours-chirurgie/index.html' },
    { route: 'protheses-mammaires', file: 'protheses-mammaires.html', output: 'protheses-mammaires/index.html' },
    { route: 'reduction-mammaire', file: 'reduction-mammaire.html', output: 'reduction-mammaire/index.html' },
    { route: 'lifting-mammaire', file: 'lifting-mammaire.html', output: 'lifting-mammaire/index.html' },
    { route: 'lipofilling-mammaire', file: 'lipofilling-mammaire.html', output: 'lipofilling-mammaire/index.html' },
    { route: 'mamelons-ombiliques', file: 'mamelons-ombiliques.html', output: 'mamelons-ombiliques/index.html' },
    { route: 'gynecomastie', file: 'gynecomastie.html', output: 'gynecomastie/index.html' },
    { route: 'lipoaspiration', file: 'lipoaspiration.html', output: 'lipoaspiration/index.html' },
    { route: 'abdominoplastie', file: 'abdominoplastie.html', output: 'abdominoplastie/index.html' },
    { route: 'body-lift', file: 'body-lift.html', output: 'body-lift/index.html' },
    { route: 'mommy-makeover', file: 'mommy-makeover.html', output: 'mommy-makeover/index.html' },
    { route: 'brachioplastie', file: 'brachioplastie.html', output: 'brachioplastie/index.html' },
    { route: 'cruroplastie', file: 'cruroplastie.html', output: 'cruroplastie/index.html' },
    { route: 'lifting-cervico-facial', file: 'lifting-cervico-facial.html', output: 'lifting-cervico-facial/index.html' },
    { route: 'blepharoplastie', file: 'blepharoplastie.html', output: 'blepharoplastie/index.html' },
    { route: 'oreilles-decollees', file: 'oreilles-decollees.html', output: 'oreilles-decollees/index.html' },
    { route: 'avant-apres', file: 'avant-apres.html', output: 'avant-apres/index.html' },
    { route: 'tarifs', file: 'tarifs.html', output: 'tarifs/index.html' },
    { route: 'mon-cabinet', file: 'mon-cabinet.html', output: 'mon-cabinet/index.html' },
    { route: 'mentions-legales', file: 'mentions-legales.html', output: 'mentions-legales/index.html' }
];

/**
 * Crée un dossier récursivement
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Copie un dossier récursivement
 */
function copyDir(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Génère une page HTML statique
 */
function generatePage(pageConfig) {
    const { route, file, output } = pageConfig;
    const seo = SEO_CONFIG[route] || SEO_CONFIG['home'];

    // Lire le template principal
    const templatePath = path.join(SRC_DIR, 'index.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Lire le contenu de la page
    const contentPath = path.join(SRC_DIR, 'pages', file);
    let content = '';

    if (fs.existsSync(contentPath)) {
        content = fs.readFileSync(contentPath, 'utf8');
    } else {
        console.warn(`Fichier non trouvé: ${contentPath}`);
        return;
    }

    // Injecter le contenu dans le template
    template = template.replace(
        /<main id="page-content">[\s\S]*?<\/main>/,
        `<main id="page-content">\n${content}\n    </main>`
    );

    // Mettre à jour le title
    template = template.replace(
        /<title>.*?<\/title>/,
        `<title>${seo.title}</title>`
    );

    // Mettre à jour la meta description
    template = template.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${seo.description}">`
    );

    // Mettre à jour le canonical
    const canonicalUrl = route === 'home' ? BASE_URL + '/' : BASE_URL + '/' + route;
    template = template.replace(
        /<link rel="canonical" href=".*?">/,
        `<link rel="canonical" href="${canonicalUrl}">`
    );

    // Mettre à jour les Open Graph tags
    template = template.replace(
        /<meta property="og:title" content=".*?">/,
        `<meta property="og:title" content="${seo.title}">`
    );
    template = template.replace(
        /<meta property="og:description" content=".*?">/,
        `<meta property="og:description" content="${seo.description}">`
    );
    template = template.replace(
        /<meta property="og:url" content=".*?">/,
        `<meta property="og:url" content="${canonicalUrl}">`
    );

    // Mettre à jour les Twitter Card tags
    template = template.replace(
        /<meta name="twitter:title" content=".*?">/,
        `<meta name="twitter:title" content="${seo.title}">`
    );
    template = template.replace(
        /<meta name="twitter:description" content=".*?">/,
        `<meta name="twitter:description" content="${seo.description}">`
    );

    // Créer le dossier de sortie
    const outputPath = path.join(DIST_DIR, output);
    ensureDir(path.dirname(outputPath));

    // Écrire le fichier
    fs.writeFileSync(outputPath, template, 'utf8');
    console.log(`✓ Généré: ${output}`);
}

/**
 * Fonction principale
 */
function main() {
    console.log('🚀 Génération des pages HTML statiques...\n');

    // Nettoyer le dossier dist
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
    ensureDir(DIST_DIR);

    // Générer chaque page
    pages.forEach(generatePage);

    // Copier les assets
    console.log('\n📁 Copie des assets...');

    // Copier CSS
    if (fs.existsSync(path.join(SRC_DIR, 'css'))) {
        copyDir(path.join(SRC_DIR, 'css'), path.join(DIST_DIR, 'css'));
        console.log('✓ CSS copié');
    }

    // Copier JS
    if (fs.existsSync(path.join(SRC_DIR, 'js'))) {
        copyDir(path.join(SRC_DIR, 'js'), path.join(DIST_DIR, 'js'));
        console.log('✓ JS copié');
    }

    // Copier images
    if (fs.existsSync(path.join(SRC_DIR, 'images'))) {
        copyDir(path.join(SRC_DIR, 'images'), path.join(DIST_DIR, 'images'));
        console.log('✓ Images copiées');
    }

    // Copier pages (pour le router dynamique)
    if (fs.existsSync(path.join(SRC_DIR, 'pages'))) {
        copyDir(path.join(SRC_DIR, 'pages'), path.join(DIST_DIR, 'pages'));
        console.log('✓ Pages copiées');
    }

    // Copier robots.txt
    if (fs.existsSync(path.join(SRC_DIR, 'robots.txt'))) {
        fs.copyFileSync(
            path.join(SRC_DIR, 'robots.txt'),
            path.join(DIST_DIR, 'robots.txt')
        );
        console.log('✓ robots.txt copié');
    }

    // Copier sitemap.xml
    if (fs.existsSync(path.join(SRC_DIR, 'sitemap.xml'))) {
        fs.copyFileSync(
            path.join(SRC_DIR, 'sitemap.xml'),
            path.join(DIST_DIR, 'sitemap.xml')
        );
        console.log('✓ sitemap.xml copié');
    }

    // Copier .htaccess
    if (fs.existsSync(path.join(SRC_DIR, '.htaccess'))) {
        fs.copyFileSync(
            path.join(SRC_DIR, '.htaccess'),
            path.join(DIST_DIR, '.htaccess')
        );
        console.log('✓ .htaccess copié');
    }

    // Copier CNAME (pour GitHub Pages)
    if (fs.existsSync(path.join(SRC_DIR, 'CNAME'))) {
        fs.copyFileSync(
            path.join(SRC_DIR, 'CNAME'),
            path.join(DIST_DIR, 'CNAME')
        );
        console.log('✓ CNAME copié');
    }

    console.log('\n✅ Génération terminée! Les fichiers sont dans le dossier docs/');
}

// Exécuter
main();
