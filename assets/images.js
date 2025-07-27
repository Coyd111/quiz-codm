/**
 * ===== QUIZ CODM - IMAGES CONFIGURATION =====
 * URLs des wallpapers Call of Duty Mobile depuis wallpaperbat.com
 * Organisés par catégories et résolutions pour optimiser le chargement
 */

// ===== CONFIGURATION DES IMAGES =====
const CODM_IMAGES = {
    
    // ===== BACKGROUNDS PRINCIPAUX =====
    backgrounds: {
        // Page d'accueil - Images HD larges
        home: [
            'https://wallpaperbat.com/img/857030-call-of-duty-mobile-hd-wallpaper-and-background.jpg', // 3840x2160 - Fond principal
            'https://wallpaperbat.com/img/118041-call-of-duty-mobile-wallpaper-top-free-call-of-duty-mobile.jpg', // 3840x2160 - Alternative
            'https://wallpaperbat.com/img/857048-call-of-duty-mobile-season-8-2020-hd-games-4k-wallpaper-image-background-photo-and-picture.jpg' // 3840x2160 - Season 8
        ],
        
        // Quiz - Images moyennes pour questions
        quiz: [
            'https://wallpaperbat.com/img/236710-call-of-duty-mobile-hd-wallpaper.jpg', // 1920x1080 - Quiz fond
            'https://wallpaperbat.com/img/669470-call-of-duty-mobile-hd-wallpaper.jpg', // 1920x1080 - Alternative
            'https://wallpaperbat.com/img/857109-call-of-duty-mobile-season-4-wallpaper-hd-games-4k-wallpaper-image-photo-and-background.jpg', // Season 4
            'https://wallpaperbat.com/img/857086-call-of-duty-mobile-2019-game-1080p-resolution-hd-4k-wallpaper-image-background-photo-and-picture.jpg' // 2019 Game
        ],
        
        // Résultats - Images spectaculaires
        results: [
            'https://wallpaperbat.com/img/857081-call-of-duty-mobile-game-mobile-wallpaper-hd-wallpaper-games-wallpaper-call-of-duty-wallpaper-call-of-duty-m-mobile-game-multiplayer-games-call-of-duty.jpg', // 3840x2160
            'https://wallpaperbat.com/img/857126-call-of-duty-mobile-hd-wallpaper-and-background.jpg', // 3840x2160
            'https://wallpaperbat.com/img/857027-call-of-duty-mobile-game-wallpaper.jpg' // 2932x2932 - Carré
        ]
    },
    
    // ===== IMAGES POUR QUESTIONS SPÉCIFIQUES =====
    questions: {
        // Personnages et skins
        characters: [
            'https://wallpaperbat.com/img/857065-hidora-kai-call-of-duty-mobile-4k-ultra-hd-mobile-wallpaper.jpg', // Hidora Kai
            'https://wallpaperbat.com/img/857064-squad-call-of-duty-mobile-4k-ultra-hd-mobile-wallpaper-call-of-duty-ghosts-call-of-duty-black-call-of-duty-zombies.jpg', // Squad
            'https://wallpaperbat.com/img/857118-cod-mobile-news-leaks-codmobile-season-9-battle-pass-character-wallpaper-twitter.jpg' // Season 9 Character
        ],
        
        // Saisons et événements
        seasons: [
            'https://wallpaperbat.com/img/857095-cod-mobile-news-leaks-codmobile-season-10-phone-wallpaper-twitter.jpg', // Season 10
            'https://wallpaperbat.com/img/642196-call-of-duty-mobile-season-12-wallpaper-4k-ultra-hd.jpg', // Season 12
            'https://wallpaperbat.com/img/857062-call-of-duty-mobile-wallpaper-2nd-collection-scan-my-dog-tag.jpg' // Collection 2
        ],
        
        // Armes et équipements
        weapons: [
            'https://wallpaperbat.com/img/327791-call-of-duty-mobile-call-of-duty-black-call-of-duty-world-hd.jpg', // Armes
            'https://wallpaperbat.com/img/857122-cod-mobile-4k-wallpaper.jpg', // 4K Mobile
            'https://wallpaperbat.com/img/305921-call-of-duty-mobile-wallpaper.jpg' // Tablette
        ],
        
        // Mobile spécifiques
        mobile: [
            'https://wallpaperbat.com/img/857018-call-of-duty-mobile-wallpaper-top-30-best-call-of-duty-mobile-wallpaper-download.jpg', // 1080x1920
            'https://wallpaperbat.com/img/641911-call-of-duty-phone-wallpaper-top-free-call-of-duty-phone-background.jpg', // Phone
            'https://wallpaperbat.com/img/857125-call-of-duty-mobile-phone-wallpaper-hd-4k-collection-call-off-duty-call-of-duty-call-of-duty-black.jpg', // Collection 4K
            'https://wallpaperbat.com/img/857127-call-of-duty-mobile-wallpaper-9-scan-my-dog-tag.jpg' // Mobile 9
        ]
    },
    
    // ===== IMAGES DÉCORATIVES =====
    decorative: {
        // Logos et icônes
        logos: [
            'https://wallpaperbat.com/img/857071-cod-mobile-wallpaper-by-vinnyvtl-download-on-zedge.jpg' // Logo design
        ],
        
        // Éléments d'interface
        ui: [
            'https://wallpaperbat.com/img/642292-call-of-duty-wallpaper.jpg' // Interface elements
        ]
    }
};

// ===== FONCTIONS UTILITAIRES =====

/**
 * Obtient une image aléatoire d'une catégorie
 * @param {string} category - Catégorie (backgrounds, questions, decorative)
 * @param {string} subcategory - Sous-catégorie
 * @returns {string} URL de l'image
 */
function getRandomImage(category, subcategory = null) {
    try {
        let imageArray;
        
        if (subcategory && CODM_IMAGES[category] && CODM_IMAGES[category][subcategory]) {
            imageArray = CODM_IMAGES[category][subcategory];
        } else if (CODM_IMAGES[category] && Array.isArray(CODM_IMAGES[category])) {
            imageArray = CODM_IMAGES[category];
        } else {
            console.warn(`Catégorie "${category}" ou sous-catégorie "${subcategory}" non trouvée`);
            return getFallbackImage();
        }
        
        const randomIndex = Math.floor(Math.random() * imageArray.length);
        return imageArray[randomIndex];
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image:', error);
        return getFallbackImage();
    }
}

/**
 * Obtient l'image de fond pour une section spécifique
 * @param {string} section - Section (home, quiz, results)
 * @returns {string} URL de l'image de fond
 */
function getBackgroundImage(section = 'home') {
    const validSections = ['home', 'quiz', 'results'];
    const targetSection = validSections.includes(section) ? section : 'home';
    
    return getRandomImage('backgrounds', targetSection);
}

/**
 * Obtient une image pour une question en fonction du type
 * @param {string} questionType - Type de question (characters, seasons, weapons, mobile)
 * @returns {string} URL de l'image
 */
function getQuestionImage(questionType = 'mobile') {
    const validTypes = ['characters', 'seasons', 'weapons', 'mobile'];
    const targetType = validTypes.includes(questionType) ? questionType : 'mobile';
    
    return getRandomImage('questions', targetType);
}

/**
 * Image de fallback en cas d'erreur
 * @returns {string} URL de l'image par défaut
 */
function getFallbackImage() {
    return 'https://wallpaperbat.com/img/236710-call-of-duty-mobile-hd-wallpaper.jpg';
}

/**
 * Précharge les images essentielles
 * @param {Array} imageUrls - URLs des images à précharger
 */
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

/**
 * Obtient toutes les images d'une catégorie pour préchargement
 * @param {string} category - Catégorie à précharger
 * @returns {Array} Tableau des URLs
 */
function getAllImagesFromCategory(category) {
    const images = [];
    
    if (CODM_IMAGES[category]) {
        Object.values(CODM_IMAGES[category]).forEach(subcategory => {
            if (Array.isArray(subcategory)) {
                images.push(...subcategory);
            }
        });
    }
    
    return images;
}

// ===== CONFIGURATION DU PRÉCHARGEMENT =====

/**
 * Initialise le préchargement des images essentielles
 */
function initializeImagePreloading() {
    // Images critiques à précharger immédiatement
    const criticalImages = [
        ...CODM_IMAGES.backgrounds.home.slice(0, 2), // 2 premiers backgrounds
        ...CODM_IMAGES.backgrounds.quiz.slice(0, 2), // 2 premiers quiz
        CODM_IMAGES.backgrounds.results[0] // Premier résultat
    ];
    
    preloadImages(criticalImages);
    
    // Préchargement progressif du reste
    setTimeout(() => {
        const allQuestionImages = getAllImagesFromCategory('questions');
        preloadImages(allQuestionImages.slice(0, 5)); // 5 premières images de questions
    }, 2000);
}

// ===== GESTION DES ERREURS D'IMAGES =====

/**
 * Gestionnaire d'erreur pour les images
 * @param {HTMLImageElement} imgElement - Élément image
 */
function handleImageError(imgElement) {
    console.warn('Erreur de chargement d\'image:', imgElement.src);
    imgElement.src = getFallbackImage();
    imgElement.alt = 'Call of Duty Mobile - Image de remplacement';
}

/**
 * Applique un style CSS à un élément avec une image de fond
 * @param {HTMLElement} element - Élément DOM
 * @param {string} imageUrl - URL de l'image
 * @param {Object} options - Options de style
 */
function setBackgroundImage(element, imageUrl, options = {}) {
    const defaultOptions = {
        size: 'cover',
        position: 'center',
        repeat: 'no-repeat'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    element.style.backgroundImage = `url('${imageUrl}')`;
    element.style.backgroundSize = finalOptions.size;
    element.style.backgroundPosition = finalOptions.position;
    element.style.backgroundRepeat = finalOptions.repeat;
    
    // Fallback en cas d'erreur
    const testImg = new Image();
    testImg.onerror = () => {
        element.style.backgroundImage = `url('${getFallbackImage()}')`;
    };
    testImg.src = imageUrl;
}

// ===== EXPORT DES FONCTIONS =====

// Pour utilisation dans d'autres fichiers JS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CODM_IMAGES,
        getRandomImage,
        getBackgroundImage,
        getQuestionImage,
        getFallbackImage,
        preloadImages,
        getAllImagesFromCategory,
        initializeImagePreloading,
        handleImageError,
        setBackgroundImage
    };
}

// ===== INITIALISATION AUTOMATIQUE =====

// Initialise le préchargement quand le DOM est prêt
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeImagePreloading);
    } else {
        initializeImagePreloading();
    }
}

// ===== STATISTIQUES DES IMAGES =====

// Informations pour le développement
const IMAGE_STATS = {
    total: Object.values(CODM_IMAGES).reduce((total, category) => {
        return total + Object.values(category).reduce((subtotal, subcategory) => {
            return subtotal + (Array.isArray(subcategory) ? subcategory.length : 0);
        }, 0);
    }, 0),
    
    byCategory: Object.keys(CODM_IMAGES).reduce((stats, category) => {
        stats[category] = Object.values(CODM_IMAGES[category]).reduce((total, subcategory) => {
            return total + (Array.isArray(subcategory) ? subcategory.length : 0);
        }, 0);
        return stats;
    }, {}),
    
    resolutions: {
        '4K': ['3840x2160'],
        'HD': ['1920x1080', '1920x1200'],
        'Mobile': ['1080x1920', '1080x2400', '2160x3840'],
        'Tablet': ['768x1024', '2932x2932']
    }
};

console.log('📷 Images CODM chargées:', IMAGE_STATS);
