/**
 * ===== QUIZ CODM - FONCTIONS UTILITAIRES =====
 * Fonctions helper et utilitaires pour l'application
 * Auteur: Coyd WILLZ
 */

// ===== UTILITAIRES DOM =====

/**
 * Sélecteur simplifié
 * @param {string} selector - Sélecteur CSS
 * @param {Element} parent - Élément parent (optionnel)
 * @returns {Element|null} Élément trouvé
 */
function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Sélecteur multiple simplifié
 * @param {string} selector - Sélecteur CSS
 * @param {Element} parent - Élément parent (optionnel)
 * @returns {NodeList} Liste des éléments trouvés
 */
function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Créé un élément DOM avec attributs
 * @param {string} tag - Tag HTML
 * @param {Object} attributes - Attributs et propriétés
 * @param {string} content - Contenu textuel (optionnel)
 * @returns {Element} Élément créé
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    if (content) {
        element.textContent = content;
    }
    
    return element;
}

/**
 * Ajoute ou supprime une classe selon une condition
 * @param {Element} element - Élément DOM
 * @param {string} className - Nom de la classe
 * @param {boolean} condition - Condition pour ajouter/supprimer
 */
function toggleClass(element, className, condition) {
    if (condition) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Vide le contenu d'un élément
 * @param {Element} element - Élément à vider
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Insère un élément après un autre
 * @param {Element} newElement - Nouvel élément
 * @param {Element} referenceElement - Élément de référence
 */
function insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

// ===== UTILITAIRES TEXTE ET FORMATAGE =====

/**
 * Met en forme le temps écoulé
 * @param {number} milliseconds - Temps en millisecondes
 * @returns {string} Temps formaté (ex: "2m 30s")
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

/**
 * Met en forme un score sur 10
 * @param {number} score - Score obtenu
 * @param {number} total - Total possible (défaut: 10)
 * @returns {string} Score formaté (ex: "8/10")
 */
function formatScore(score, total = 10) {
    return `${score}/${total}`;
}

/**
 * Calcule le pourcentage
 * @param {number} score - Score obtenu
 * @param {number} total - Total possible
 * @returns {number} Pourcentage arrondi
 */
function calculatePercentage(score, total) {
    return Math.round((score / total) * 100);
}

/**
 * Capitalise la première lettre
 * @param {string} str - Chaîne à capitaliser
 * @returns {string} Chaîne capitalisée
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Tronque un texte avec des points de suspension
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Enlève les accents d'une chaîne
 * @param {string} str - Chaîne avec accents
 * @returns {string} Chaîne sans accents
 */
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ===== UTILITAIRES ARRAY ET OBJETS =====

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} Nouveau tableau mélangé
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Sélectionne des éléments aléatoires d'un tableau
 * @param {Array} array - Tableau source
 * @param {number} count - Nombre d'éléments à sélectionner
 * @returns {Array} Tableau avec éléments sélectionnés
 */
function getRandomElements(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Trouve un élément par propriété
 * @param {Array} array - Tableau d'objets
 * @param {string} property - Propriété à rechercher
 * @param {any} value - Valeur à trouver
 * @returns {Object|null} Objet trouvé ou null
 */
function findByProperty(array, property, value) {
    return array.find(item => item[property] === value) || null;
}

/**
 * Groupe un tableau d'objets par propriété
 * @param {Array} array - Tableau d'objets
 * @param {string} property - Propriété de groupement
 * @returns {Object} Objet groupé
 */
function groupBy(array, property) {
    return array.reduce((groups, item) => {
        const key = item[property];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}

/**
 * Supprime les doublons d'un tableau
 * @param {Array} array - Tableau avec doublons
 * @param {string} property - Propriété pour comparaison (optionnel)
 * @returns {Array} Tableau sans doublons
 */
function removeDuplicates(array, property = null) {
    if (property) {
        return array.filter((item, index, self) => 
            index === self.findIndex(t => t[property] === item[property])
        );
    }
    return [...new Set(array)];
}

// ===== UTILITAIRES NOMBRE ET MATH =====

/**
 * Génère un nombre aléatoire entre min et max (inclus)
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} Nombre aléatoire
 */
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Limite une valeur entre min et max
 * @param {number} value - Valeur à limiter
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} Valeur limitée
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Arrondit un nombre à un certain nombre de décimales
 * @param {number} number - Nombre à arrondir
 * @param {number} decimals - Nombre de décimales
 * @returns {number} Nombre arrondi
 */
function roundTo(number, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
}

/**
 * Vérifie si un nombre est dans une plage
 * @param {number} value - Valeur à vérifier
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {boolean} True si dans la plage
 */
function isInRange(value, min, max) {
    return value >= min && value <= max;
}

// ===== UTILITAIRES DATE ET TEMPS =====

/**
 * Formate une date en français
 * @param {Date} date - Date à formater
 * @param {string} format - Format ('short', 'long', 'time')
 * @returns {string} Date formatée
 */
function formatDate(date, format = 'short') {
    const options = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return date.toLocaleDateString('fr-FR', options[format] || options.short);
}

/**
 * Calcule la différence en jours entre deux dates
 * @param {Date} date1 - Première date
 * @param {Date} date2 - Deuxième date
 * @returns {number} Différence en jours
 */
function daysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * Vérifie si c'est aujourd'hui
 * @param {Date} date - Date à vérifier
 * @returns {boolean} True si c'est aujourd'hui
 */
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Obtient le début de la journée
 * @param {Date} date - Date de référence
 * @returns {Date} Début de la journée
 */
function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

// ===== UTILITAIRES VALIDATION =====

/**
 * Vérifie si une valeur est vide
 * @param {any} value - Valeur à vérifier
 * @returns {boolean} True si vide
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Vérifie si une chaîne est un email valide
 * @param {string} email - Email à vérifier
 * @returns {boolean} True si email valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Vérifie si une valeur est un nombre
 * @param {any} value - Valeur à vérifier
 * @returns {boolean} True si nombre
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// ===== UTILITAIRES PERFORMANCE =====

/**
 * Fonction de debounce
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en millisecondes
 * @returns {Function} Fonction débouncée
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Fonction de throttle
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Limite en millisecondes
 * @returns {Function} Fonction throttlée
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Mesure le temps d'exécution d'une fonction
 * @param {Function} func - Fonction à mesurer
 * @param {...any} args - Arguments de la fonction
 * @returns {Object} Résultat et temps d'exécution
 */
function measureTime(func, ...args) {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    return {
        result,
        executionTime: end - start
    };
}

// ===== UTILITAIRES BROWSER ET DEVICE =====

/**
 * Détecte si l'appareil est mobile
 * @returns {boolean} True si mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Détecte si l'appareil est en mode tactile
 * @returns {boolean} True si tactile
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Obtient les dimensions de la viewport
 * @returns {Object} Largeur et hauteur
 */
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} Succès de l'opération
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            textArea.remove();
            return successful;
        }
    } catch (error) {
        console.error('Erreur lors de la copie:', error);
        return false;
    }
}

// ===== UTILITAIRES STORAGE =====

/**
 * Sauvegarde sécurisée dans localStorage
 * @param {string} key - Clé de stockage
 * @param {any} value - Valeur à sauvegarder
 * @returns {boolean} Succès de l'opération
 */
function saveToStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return false;
    }
}

/**
 * Chargement sécurisé depuis localStorage
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} Valeur chargée ou valeur par défaut
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        return defaultValue;
    }
}

/**
 * Supprime une clé du localStorage
 * @param {string} key - Clé à supprimer
 * @returns {boolean} Succès de l'opération
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return false;
    }
}

// ===== UTILITAIRES QUIZ SPÉCIFIQUES =====

/**
 * Génère un message personnalisé selon le score
 * @param {number} score - Score obtenu
 * @param {number} total - Total possible
 * @returns {string} Message personnalisé
 */
function getScoreMessage(score, total) {
    const percentage = calculatePercentage(score, total);
    
    if (percentage === 100) {
        return "🔥 PARFAIT ! Tu es un vrai expert CODM ! 🏆";
    } else if (percentage >= 90) {
        return "🎯 Excellent ! Tu maîtrises CODM comme un pro ! 💪";
    } else if (percentage >= 80) {
        return "👍 Très bien ! Tu connais bien l'univers CODM ! ⭐";
    } else if (percentage >= 70) {
        return "😊 Pas mal ! Continue à jouer pour t'améliorer ! 🎮";
    } else if (percentage >= 50) {
        return "🤔 Peut mieux faire ! Retente ta chance ! 📚";
    } else {
        return "💪 Allez ! Un peu plus d'entraînement et ça va le faire ! 🎯";
    }
}

/**
 * Génère des émojis selon le score
 * @param {number} score - Score obtenu
 * @param {number} total - Total possible
 * @returns {string} Émojis appropriés
 */
function getScoreEmojis(score, total) {
    const percentage = calculatePercentage(score, total);
    
    if (percentage === 100) return "🔥🏆🎯";
    if (percentage >= 90) return "🎯💪⭐";
    if (percentage >= 80) return "👍⭐🎮";
    if (percentage >= 70) return "😊📚🎯";
    if (percentage >= 50) return "🤔💪📖";
    return "💪🎯📚";
}

// ===== EXPORT DES FONCTIONS =====

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // DOM
        $, $$, createElement, toggleClass, clearElement, insertAfter,
        
        // Formatage
        formatTime, formatScore, calculatePercentage, capitalize, truncateText, removeAccents,
        
        // Array/Objets
        shuffleArray, getRandomElements, findByProperty, groupBy, removeDuplicates,
        
        // Math
        randomBetween, clamp, roundTo, isInRange,
        
        // Date
        formatDate, daysDifference, isToday, startOfDay,
        
        // Validation
        isEmpty, isValidEmail, isNumber,
        
        // Performance
        debounce, throttle, measureTime,
        
        // Browser
        isMobile, isTouchDevice, getViewportSize, copyToClipboard,
        
        // Storage
        saveToStorage, loadFromStorage, removeFromStorage,
        
        // Quiz
        getScoreMessage, getScoreEmojis
    };
}

// ===== AJOUT AU CONTEXTE GLOBAL =====

// Rendre les fonctions principales disponibles globalement
window.Utils = {
    $, $$, createElement, toggleClass, clearElement,
    formatTime, formatScore, calculatePercentage,
    shuffleArray, getRandomElements, randomBetween,
    debounce, throttle, isMobile, copyToClipboard,
    saveToStorage, loadFromStorage, removeFromStorage,
    getScoreMessage, getScoreEmojis
};

console.log('🔧 Quiz CODM - Utilitaires chargés');
