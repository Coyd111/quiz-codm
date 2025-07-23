// ===== UTILS.JS - FONCTIONS UTILITAIRES QUIZ CODM =====

// ===== CONSTANTES UTILITAIRES =====
const UTILS_CONFIG = {
    // Formats de date
    DATE_FORMATS: {
        SHORT: 'DD/MM/YYYY',
        LONG: 'DD MMMM YYYY',
        TIME: 'HH:mm',
        FULL: 'DD/MM/YYYY HH:mm'
    },
    
    // Messages d'erreur communs
    ERROR_MESSAGES: {
        NETWORK: 'Erreur de connexion. Vérifiez votre internet.',
        STORAGE: 'Erreur de stockage local. Espace insuffisant ?',
        VALIDATION: 'Données invalides. Vérifiez vos informations.',
        TIMEOUT: 'Opération expirée. Réessayez plus tard.',
        GENERIC: 'Une erreur inattendue s\'est produite.'
    },
    
    // Durées communes (en millisecondes)
    DURATIONS: {
        SECOND: 1000,
        MINUTE: 60 * 1000,
        HOUR: 60 * 60 * 1000,
        DAY: 24 * 60 * 60 * 1000,
        WEEK: 7 * 24 * 60 * 60 * 1000,
        MONTH: 40 * 24 * 60 * 60 * 1000
    },
    
    // Expressions régulières communes
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PSEUDO: /^[a-zA-Z0-9_-]{3,20}$/,
        URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        PHONE: /^(?:\+33|0)[1-9](?:[0-9]{8})$/
    }
};

// ===== CLASSE PRINCIPALE DES UTILITAIRES =====
class QuizUtils {
    
    // ===== GESTION DES DATES =====
    
    /**
     * Formate une date selon le format spécifié
     * @param {Date|string|number} date - Date à formater
     * @param {string} format - Format souhaité
     * @returns {string} Date formatée
     */
    static formatDate(date, format = 'DD/MM/YYYY') {
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'Date invalide';
            
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            
            const monthNames = [
                'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
            ];
            
            switch (format) {
                case 'DD/MM/YYYY':
                    return `${day}/${month}/${year}`;
                case 'DD MMMM YYYY':
                    return `${day} ${monthNames[d.getMonth()]} ${year}`;
                case 'HH:mm':
                    return `${hours}:${minutes}`;
                case 'DD/MM/YYYY HH:mm':
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                default:
                    return d.toLocaleDateString('fr-FR');
            }
        } catch (error) {
            console.error('❌ Erreur formatage date:', error);
            return 'Erreur date';
        }
    }
    
    /**
     * Calcule le temps écoulé depuis une date
     * @param {Date|string|number} date - Date de référence
     * @returns {string} Temps écoulé en français
     */
    static getTimeAgo(date) {
        try {
            const now = new Date();
            const past = new Date(date);
            const diffMs = now - past;
            
            if (diffMs < UTILS_CONFIG.DURATIONS.MINUTE) {
                return 'À l\'instant';
            } else if (diffMs < UTILS_CONFIG.DURATIONS.HOUR) {
                const minutes = Math.floor(diffMs / UTILS_CONFIG.DURATIONS.MINUTE);
                return `Il y a ${minutes}min`;
            } else if (diffMs < UTILS_CONFIG.DURATIONS.DAY) {
                const hours = Math.floor(diffMs / UTILS_CONFIG.DURATIONS.HOUR);
                return `Il y a ${hours}h`;
            } else if (diffMs < UTILS_CONFIG.DURATIONS.WEEK) {
                const days = Math.floor(diffMs / UTILS_CONFIG.DURATIONS.DAY);
                return `Il y a ${days}j`;
            } else {
                return this.formatDate(date, 'DD/MM/YYYY');
            }
        } catch (error) {
            console.error('❌ Erreur calcul temps écoulé:', error);
            return 'Date inconnue';
        }
    }
    
    /**
     * Vérifie si une date est aujourd'hui
     * @param {Date|string|number} date - Date à vérifier
     * @returns {boolean} True si c'est aujourd'hui
     */
    static isToday(date) {
        try {
            const today = new Date();
            const checkDate = new Date(date);
            return today.toDateString() === checkDate.toDateString();
        } catch (error) {
            return false;
        }
    }
    
    // ===== VALIDATION DES DONNÉES =====
    
    /**
     * Valide une adresse email
     * @param {string} email - Email à valider
     * @returns {boolean} True si valide
     */
    static isValidEmail(email) {
        return typeof email === 'string' && UTILS_CONFIG.REGEX.EMAIL.test(email.trim());
    }
    
    /**
     * Valide un pseudo utilisateur
     * @param {string} pseudo - Pseudo à valider
     * @returns {object} Résultat de validation avec détails
     */
    static validatePseudo(pseudo) {
        if (!pseudo || typeof pseudo !== 'string') {
            return { valid: false, error: 'Pseudo requis' };
        }
        
        const trimmed = pseudo.trim();
        
        if (trimmed.length < 3) {
            return { valid: false, error: 'Pseudo trop court (min 3 caractères)' };
        }
        
        if (trimmed.length > 20) {
            return { valid: false, error: 'Pseudo trop long (max 20 caractères)' };
        }
        
        if (!UTILS_CONFIG.REGEX.PSEUDO.test(trimmed)) {
            return { valid: false, error: 'Caractères autorisés: lettres, chiffres, - et _' };
        }
        
        // Vérifier les mots interdits
        const forbiddenWords = ['admin', 'codm', 'quiz', 'bot', 'null', 'undefined'];
        if (forbiddenWords.some(word => trimmed.toLowerCase().includes(word))) {
            return { valid: false, error: 'Ce pseudo n\'est pas autorisé' };
        }
        
        return { valid: true, pseudo: trimmed };
    }
    
    /**
     * Valide une URL
     * @param {string} url - URL à valider
     * @returns {boolean} True si valide
     */
    static isValidURL(url) {
        return typeof url === 'string' && UTILS_CONFIG.REGEX.URL.test(url);
    }
    
    /**
     * Nettoie et valide une entrée de texte
     * @param {string} text - Texte à nettoyer
     * @param {number} maxLength - Longueur maximale
     * @returns {string} Texte nettoyé
     */
    static sanitizeText(text, maxLength = 1000) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .trim()
            .replace(/[<>'"]/g, '') // Suppression caractères dangereux
            .substring(0, maxLength);
    }
    
    // ===== MANIPULATION DES TABLEAUX =====
    
    /**
     * Mélange un tableau aléatoirement
     * @param {Array} array - Tableau à mélanger
     * @returns {Array} Nouveau tableau mélangé
     */
    static shuffleArray(array) {
        if (!Array.isArray(array)) return [];
        
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * Sélectionne des éléments aléatoires d'un tableau
     * @param {Array} array - Tableau source
     * @param {number} count - Nombre d'éléments à sélectionner
     * @returns {Array} Éléments sélectionnés
     */
    static getRandomElements(array, count) {
        if (!Array.isArray(array) || count <= 0) return [];
        
        const shuffled = this.shuffleArray(array);
        return shuffled.slice(0, Math.min(count, array.length));
    }
    
    /**
     * Groupe un tableau par propriété
     * @param {Array} array - Tableau à grouper
     * @param {string|function} key - Clé ou fonction de groupage
     * @returns {Object} Objet groupé
     */
    static groupBy(array, key) {
        if (!Array.isArray(array)) return {};
        
        return array.reduce((groups, item) => {
            const groupKey = typeof key === 'function' ? key(item) : item[key];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});
    }
    
    // ===== MANIPULATION DES NOMBRES =====
    
    /**
     * Génère un nombre aléatoire entre min et max
     * @param {number} min - Valeur minimale
     * @param {number} max - Valeur maximale
     * @returns {number} Nombre aléatoire
     */
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Formate un nombre avec séparateurs de milliers
     * @param {number} number - Nombre à formater
     * @returns {string} Nombre formaté
     */
    static formatNumber(number) {
        if (typeof number !== 'number') return '0';
        return number.toLocaleString('fr-FR');
    }
    
    /**
     * Calcule un pourcentage
     * @param {number} value - Valeur
     * @param {number} total - Total
     * @param {number} decimals - Nombre de décimales
     * @returns {number} Pourcentage
     */
    static getPercentage(value, total, decimals = 1) {
        if (total === 0) return 0;
        return parseFloat(((value / total) * 100).toFixed(decimals));
    }
    
    // ===== GESTION DU STOCKAGE LOCAL =====
    
    /**
     * Sauvegarde sécurisée dans localStorage
     * @param {string} key - Clé de stockage
     * @param {any} value - Valeur à stocker
     * @returns {boolean} Succès de la sauvegarde
     */
    static secureSetItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('❌ Erreur localStorage set:', error);
            this.showNotification(UTILS_CONFIG.ERROR_MESSAGES.STORAGE, 'error');
            return false;
        }
    }
    
    /**
     * Récupération sécurisée depuis localStorage
     * @param {string} key - Clé de stockage
     * @param {any} defaultValue - Valeur par défaut
     * @returns {any} Valeur récupérée ou par défaut
     */
    static secureGetItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('❌ Erreur localStorage get:', error);
            return defaultValue;
        }
    }
    
    /**
     * Suppression sécurisée du localStorage
     * @param {string} key - Clé à supprimer
     * @returns {boolean} Succès de la suppression
     */
    static secureRemoveItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('❌ Erreur localStorage remove:', error);
            return false;
        }
    }
    
    /**
     * Vérifie l'espace disponible dans localStorage
     * @returns {object} Informations sur l'espace de stockage
     */
    static getStorageInfo() {
        try {
            let used = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    used += localStorage[key].length + key.length;
                }
            }
            
            // Estimation de l'espace total (généralement ~5-10MB)
            const total = 5 * 1024 * 1024; // 5MB
            const usedMB = (used / 1024 / 1024).toFixed(2);
            const totalMB = (total / 1024 / 1024).toFixed(2);
            const percentage = this.getPercentage(used, total, 1);
            
            return {
                used: used,
                usedMB: usedMB,
                total: total,
                totalMB: totalMB,
                percentage: percentage,
                available: total - used
            };
        } catch (error) {
            console.error('❌ Erreur info stockage:', error);
            return { error: 'Impossible de calculer l\'espace' };
        }
    }
    
    // ===== GESTION DES ANIMATIONS ET INTERFACE =====
    
    /**
     * Attend la fin d'une animation CSS
     * @param {HTMLElement} element - Élément à observer
     * @returns {Promise} Promesse résolue à la fin de l'animation
     */
    static waitForAnimation(element) {
        return new Promise((resolve) => {
            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }
    
    /**
     * Fait défiler vers un élément en douceur
     * @param {HTMLElement|string} target - Élément ou sélecteur
     * @param {number} offset - Décalage en pixels
     */
    static smoothScrollTo(target, offset = 0) {
        try {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('❌ Erreur scroll:', error);
        }
    }
    
    /**
     * Ajoute une classe temporairement
     * @param {HTMLElement} element - Élément cible
     * @param {string} className - Classe à ajouter
     * @param {number} duration - Durée en millisecondes
     */
    static addTemporaryClass(element, className, duration = 3000) {
        if (!element) return;
        
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }
    
    // ===== GESTION DES ÉVÉNEMENTS =====
    
    /**
     * Debounce une fonction (évite les appels répétés)
     * @param {function} func - Fonction à débouncer
     * @param {number} delay - Délai en millisecondes
     * @returns {function} Fonction débouncée
     */
    static debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    /**
     * Throttle une fonction (limite la fréquence d'exécution)
     * @param {function} func - Fonction à throttler
     * @param {number} delay - Délai en millisecondes
     * @returns {function} Fonction throttlée
     */
    static throttle(func, delay = 100) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }
    
    // ===== DÉTECTION DE L'ENVIRONNEMENT =====
    
    /**
     * Détecte si l'utilisateur est sur mobile
     * @returns {boolean} True si mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    /**
     * Détecte le navigateur utilisé
     * @returns {string} Nom du navigateur
     */
    static getBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
        if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) return 'Opera';
        if (userAgent.indexOf('Trident') !== -1) return 'Internet Explorer';
        if (userAgent.indexOf('Edge') !== -1) return 'Edge';
        if (userAgent.indexOf('Chrome') !== -1) return 'Chrome';
        if (userAgent.indexOf('Safari') !== -1) return 'Safari';
        
        return 'Unknown';
    }
    
    /**
     * Vérifie si le localStorage est supporté
     * @returns {boolean} True si supporté
     */
    static isLocalStorageSupported() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // ===== GÉNÉRATEURS D'ID ET CODES =====
    
    /**
     * Génère un ID unique
     * @param {string} prefix - Préfixe optionnel
     * @returns {string} ID unique
     */
    static generateUniqueId(prefix = 'id') {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2, 9);
        return `${prefix}_${timestamp}_${randomPart}`;
    }
    
    /**
     * Génère un code aléatoire
     * @param {number} length - Longueur du code
     * @param {string} chars - Caractères autorisés
     * @returns {string} Code généré
     */
    static generateCode(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // ===== SYSTÈME DE NOTIFICATION =====
    
    /**
     * Affiche une notification toast
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (success, error, warning, info)
     * @param {number} duration - Durée d'affichage
     */
    static showNotification(message, type = 'info', duration = 5000) {
        // Supprimer les notifications existantes du même type
        const existing = document.querySelectorAll(`.utils-notification.${type}`);
        existing.forEach(notif => notif.remove());
        
        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = `utils-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Ajouter les styles si nécessaire
        this.ensureNotificationStyles();
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    /**
     * Obtient l'icône pour un type de notification
     * @param {string} type - Type de notification
     * @returns {string} Icône HTML
     */
    static getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * S'assure que les styles de notification sont présents
     */
    static ensureNotificationStyles() {
        if (document.getElementById('utils-notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'utils-notification-styles';
        styles.textContent = `
            .utils-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .utils-notification.show {
                transform: translateX(0);
            }
            .utils-notification.success {
                border-left: 4px solid #28a745;
            }
            .utils-notification.error {
                border-left: 4px solid #dc3545;
            }
            .utils-notification.warning {
                border-left: 4px solid #ffc107;
            }
            .utils-notification.info {
                border-left: 4px solid #17a2b8;
            }
            .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-icon {
                font-size: 18px;
                flex-shrink: 0;
            }
            .notification-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                transition: background-color 0.2s;
            }
            .notification-close:hover {
                background-color: #f0f0f0;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // ===== GESTION DES ERREURS =====
    
    /**
     * Logger d'erreurs centralisé
     * @param {Error|string} error - Erreur à logger
     * @param {string} context - Contexte de l'erreur
     * @param {object} data - Données additionnelles
     */
    static logError(error, context = 'Unknown', data = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            context: context,
            message: error?.message || error,
            stack: error?.stack || 'No stack trace',
            userAgent: navigator.userAgent,
            url: window.location.href,
            data: data
        };
        
        console.error('🚨 Erreur Quiz CODM:', errorInfo);
        
        // Sauvegarder les erreurs critiques
        this.saveErrorLog(errorInfo);
    }
    
    /**
     * Sauvegarde un log d'erreur
     * @param {object} errorInfo - Informations sur l'erreur
     */
    static saveErrorLog(errorInfo) {
        try {
            const logs = this.secureGetItem('quizCODM_errorLogs', []);
            logs.push(errorInfo);
            
            // Garder seulement les 50 dernières erreurs
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            this.secureSetItem('quizCODM_errorLogs', logs);
        } catch (error) {
            console.error('❌ Impossible de sauvegarder le log d\'erreur:', error);
        }
    }
    
    // ===== MÉTHODES DE PERFORMANCE =====
    
    /**
     * Mesure le temps d'exécution d'une fonction
     * @param {function} func - Fonction à mesurer
     * @param {string} label - Libellé pour l'affichage
     * @returns {any} Résultat de la fonction
     */
    static measurePerformance(func, label = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    /**
     * Créée un délai d'attente
     * @param {number} ms - Millisecondes d'attente
     * @returns {Promise} Promesse résolue après le délai
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== INITIALISATION GLOBALE =====
window.QuizUtils = QuizUtils;

// ===== FONCTIONS HELPER GLOBALES =====

/**
 * Fonction de logging pratique
 * @param {string} message - Message à logger
 * @param {string} type - Type de log
 */
window.qLog = function(message, type = 'info') {
    const timestamp = QuizUtils.formatDate(new Date(), 'DD/MM/YYYY HH:mm');
    const prefix = `🎮 [${timestamp}]`;
    
    switch (type) {
        case 'error':
            console.error(`${prefix} ❌`, message);
            break;
        case 'warn':
            console.warn(`${prefix} ⚠️`, message);
            break;
        case 'success':
            console.log(`${prefix} ✅`, message);
            break;
        default:
            console.log(`${prefix} ℹ️`, message);
    }
};

/**
 * Notification rapide
 * @param {string} message - Message
 * @param {string} type - Type
 */
window.qNotify = function(message, type = 'info') {
    QuizUtils.showNotification(message, type);
};

/**
 * Validation rapide d'email
 * @param {string} email - Email à valider
 * @returns {boolean}
 */
window.isValidEmail = function(email) {
    return QuizUtils.isValidEmail(email);
};

/**
 * Formatage rapide de date
 * @param {Date} date - Date à formater
 * @param {string} format - Format
 * @returns {string}
 */
window.formatDate = function(date, format) {
    return QuizUtils.formatDate(date, format);
};

// ===== AUTO-INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des utilitaires
    console.log('🛠️ Utilitaires Quiz CODM chargés');
    
    // Gestion globale des erreurs
    window.addEventListener('error', (event) => {
        QuizUtils.logError(event.error, 'Global Error', {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });
    
    // Gestion des promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
        QuizUtils.logError(event.reason, 'Unhandled Promise Rejection');
    });
});

console.log('🛠️ Module utilitaires chargé - Quiz CODM');
