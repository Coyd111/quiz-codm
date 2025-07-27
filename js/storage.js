/**
 * ===== QUIZ CODM - GESTION DU STOCKAGE =====
 * localStorage pour scores, classements et statistiques utilisateur
 * Auteur: Coyd WILLZ
 */

// ===== CONFIGURATION DU STOCKAGE =====
const STORAGE_CONFIG = {
    prefix: 'codm_quiz_',
    maxLeaderboardEntries: 100,
    maxHistoryEntries: 50,
    dataVersion: '1.0',
    autoCleanup: true,
    backupInterval: 24 * 60 * 60 * 1000 // 24 heures
};

// ===== CLÉS DE STOCKAGE =====
const STORAGE_KEYS = {
    // Scores et classements
    leaderboard: 'leaderboard',
    userBestScore: 'user_best_score',
    userStats: 'user_stats',
    
    // Historique des parties
    gameHistory: 'game_history',
    dailyStats: 'daily_stats',
    
    // Préférences utilisateur
    userPreferences: 'user_preferences',
    userName: 'user_name',
    
    // Données techniques
    lastCleanup: 'last_cleanup',
    dataVersion: 'data_version',
    installDate: 'install_date'
};

// ===== STRUCTURE DES DONNÉES =====

/**
 * Structure d'une entrée de score
 */
const ScoreEntry = {
    id: null,           // ID unique de la partie
    playerName: '',     // Nom du joueur
    score: 0,           // Score obtenu (/10)
    percentage: 0,      // Pourcentage de réussite
    timeElapsed: 0,     // Temps écoulé en millisecondes
    date: null,         // Date de la partie
    questionsCount: 10, // Nombre de questions
    difficulty: 'mixed', // Difficulté du quiz
    category: 'mixed'   // Catégorie des questions
};

/**
 * Structure des statistiques utilisateur
 */
const UserStats = {
    totalGames: 0,           // Nombre total de parties
    totalCorrectAnswers: 0,  // Réponses correctes totales
    totalQuestions: 0,       // Questions totales posées
    bestScore: 0,            // Meilleur score
    bestPercentage: 0,       // Meilleur pourcentage
    averageScore: 0,         // Score moyen
    averageTime: 0,          // Temps moyen par partie
    streak: 0,               // Série de bonnes réponses
    bestStreak: 0,           // Meilleure série
    playDays: 0,             // Jours de jeu
    createdAt: null,         // Date de création
    updatedAt: null          // Dernière mise à jour
};

// ===== FONCTIONS DE BASE =====

/**
 * Génère une clé complète avec préfixe
 * @param {string} key - Clé de base
 * @returns {string} Clé avec préfixe
 */
function getStorageKey(key) {
    return STORAGE_CONFIG.prefix + key;
}

/**
 * Sauvegarde sécurisée dans localStorage
 * @param {string} key - Clé de stockage
 * @param {any} data - Données à sauvegarder
 * @returns {boolean} Succès de l'opération
 */
function saveData(key, data) {
    try {
        const fullKey = getStorageKey(key);
        const serializedData = JSON.stringify({
            data: data,
            timestamp: Date.now(),
            version: STORAGE_CONFIG.dataVersion
        });
        
        localStorage.setItem(fullKey, serializedData);
        console.log(`💾 Données sauvegardées: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur sauvegarde ${key}:`, error);
        
        // Tentative de nettoyage en cas de quota dépassé
        if (error.name === 'QuotaExceededError') {
            performCleanup();
            // Réessayer une fois
            try {
                localStorage.setItem(getStorageKey(key), JSON.stringify(data));
                return true;
            } catch (retryError) {
                console.error('❌ Échec après nettoyage:', retryError);
            }
        }
        return false;
    }
}

/**
 * Chargement sécurisé depuis localStorage
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} Données chargées ou valeur par défaut
 */
function loadData(key, defaultValue = null) {
    try {
        const fullKey = getStorageKey(key);
        const item = localStorage.getItem(fullKey);
        
        if (!item) {
            return defaultValue;
        }
        
        const parsed = JSON.parse(item);
        
        // Vérifier la structure des données
        if (parsed && typeof parsed === 'object' && parsed.data !== undefined) {
            return parsed.data;
        }
        
        // Format ancien ou simple
        return parsed || defaultValue;
    } catch (error) {
        console.error(`❌ Erreur chargement ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Supprime une clé du localStorage
 * @param {string} key - Clé à supprimer
 * @returns {boolean} Succès de l'opération
 */
function removeData(key) {
    try {
        const fullKey = getStorageKey(key);
        localStorage.removeItem(fullKey);
        console.log(`🗑️ Données supprimées: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur suppression ${key}:`, error);
        return false;
    }
}

// ===== GESTION DES SCORES =====

/**
 * Sauvegarde un nouveau score
 * @param {Object} scoreData - Données du score
 * @returns {boolean} Succès de l'opération
 */
function saveScore(scoreData) {
    try {
        // Créer l'entrée de score
        const scoreEntry = {
            ...ScoreEntry,
            ...scoreData,
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            percentage: Math.round((scoreData.score / scoreData.questionsCount) * 100)
        };
        
        // Sauvegarder dans l'historique
        addToGameHistory(scoreEntry);
        
        // Mettre à jour le classement
        updateLeaderboard(scoreEntry);
        
        // Mettre à jour les statistiques utilisateur
        updateUserStats(scoreEntry);
        
        // Mettre à jour le meilleur score personnel
        updatePersonalBest(scoreEntry);
        
        console.log('🏆 Score sauvegardé:', scoreEntry);
        return true;
    } catch (error) {
        console.error('❌ Erreur sauvegarde score:', error);
        return false;
    }
}

/**
 * Ajoute une partie à l'historique
 * @param {Object} scoreEntry - Entrée de score
 */
function addToGameHistory(scoreEntry) {
    let history = loadData(STORAGE_KEYS.gameHistory, []);
    
    // Ajouter la nouvelle partie
    history.unshift(scoreEntry);
    
    // Limiter le nombre d'entrées
    if (history.length > STORAGE_CONFIG.maxHistoryEntries) {
        history = history.slice(0, STORAGE_CONFIG.maxHistoryEntries);
    }
    
    saveData(STORAGE_KEYS.gameHistory, history);
}

/**
 * Met à jour le classement
 * @param {Object} scoreEntry - Nouvelle entrée
 */
function updateLeaderboard(scoreEntry) {
    let leaderboard = loadData(STORAGE_KEYS.leaderboard, []);
    
    // Ajouter la nouvelle entrée
    leaderboard.push(scoreEntry);
    
    // Trier par score décroissant, puis par temps croissant
    leaderboard.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score; // Score décroissant
        }
        return a.timeElapsed - b.timeElapsed; // Temps croissant
    });
    
    // Limiter le nombre d'entrées
    if (leaderboard.length > STORAGE_CONFIG.maxLeaderboardEntries) {
        leaderboard = leaderboard.slice(0, STORAGE_CONFIG.maxLeaderboardEntries);
    }
    
    saveData(STORAGE_KEYS.leaderboard, leaderboard);
}

/**
 * Met à jour les statistiques utilisateur
 * @param {Object} scoreEntry - Nouvelle partie
 */
function updateUserStats(scoreEntry) {
    let stats = loadData(STORAGE_KEYS.userStats, { ...UserStats });
    
    // Initialiser si première fois
    if (!stats.createdAt) {
        stats.createdAt = new Date().toISOString();
    }
    
    // Mettre à jour les statistiques
    stats.totalGames++;
    stats.totalCorrectAnswers += scoreEntry.score;
    stats.totalQuestions += scoreEntry.questionsCount;
    
    // Calculer le nouveau score moyen
    stats.averageScore = Math.round((stats.totalCorrectAnswers / stats.totalGames) * 100) / 100;
    
    // Calculer le nouveau temps moyen
    const totalTime = (stats.averageTime * (stats.totalGames - 1)) + scoreEntry.timeElapsed;
    stats.averageTime = Math.round(totalTime / stats.totalGames);
    
    // Mettre à jour les records
    if (scoreEntry.score > stats.bestScore) {
        stats.bestScore = scoreEntry.score;
    }
    
    if (scoreEntry.percentage > stats.bestPercentage) {
        stats.bestPercentage = scoreEntry.percentage;
    }
    
    // Mettre à jour la série
    if (scoreEntry.score === scoreEntry.questionsCount) {
        stats.streak++;
        if (stats.streak > stats.bestStreak) {
            stats.bestStreak = stats.streak;
        }
    } else {
        stats.streak = 0;
    }
    
    // Compter les jours de jeu uniques
    const today = new Date().toDateString();
    const lastPlayDate = stats.lastPlayDate;
    if (lastPlayDate !== today) {
        stats.playDays++;
        stats.lastPlayDate = today;
    }
    
    stats.updatedAt = new Date().toISOString();
    
    saveData(STORAGE_KEYS.userStats, stats);
}

/**
 * Met à jour le meilleur score personnel
 * @param {Object} scoreEntry - Nouvelle partie
 */
function updatePersonalBest(scoreEntry) {
    const currentBest = loadData(STORAGE_KEYS.userBestScore, null);
    
    if (!currentBest || 
        scoreEntry.score > currentBest.score || 
        (scoreEntry.score === currentBest.score && scoreEntry.timeElapsed < currentBest.timeElapsed)) {
        
        saveData(STORAGE_KEYS.userBestScore, scoreEntry);
        console.log('🎯 Nouveau record personnel!');
    }
}

// ===== FONCTIONS DE RÉCUPÉRATION =====

/**
 * Récupère le classement complet
 * @param {number} limit - Nombre d'entrées à retourner
 * @returns {Array} Classement trié
 */
function getLeaderboard(limit = 10) {
    const leaderboard = loadData(STORAGE_KEYS.leaderboard, []);
    return leaderboard.slice(0, limit);
}

/**
 * Récupère l'historique des parties
 * @param {number} limit - Nombre d'entrées à retourner
 * @returns {Array} Historique des parties
 */
function getGameHistory(limit = 20) {
    const history = loadData(STORAGE_KEYS.gameHistory, []);
    return history.slice(0, limit);
}

/**
 * Récupère les statistiques utilisateur
 * @returns {Object} Statistiques complètes
 */
function getUserStats() {
    return loadData(STORAGE_KEYS.userStats, { ...UserStats });
}

/**
 * Récupère le meilleur score personnel
 * @returns {Object|null} Meilleur score ou null
 */
function getPersonalBest() {
    return loadData(STORAGE_KEYS.userBestScore, null);
}

/**
 * Récupère les statistiques du jour
 * @returns {Object} Stats quotidiennes
 */
function getDailyStats() {
    const today = new Date().toDateString();
    let dailyStats = loadData(STORAGE_KEYS.dailyStats, {});
    
    if (!dailyStats[today]) {
        dailyStats[today] = {
            gamesPlayed: 0,
            totalScore: 0,
            bestScore: 0,
            averageScore: 0,
            timeSpent: 0
        };
    }
    
    return dailyStats[today];
}

// ===== GESTION DU NOM UTILISATEUR =====

/**
 * Sauvegarde le nom d'utilisateur
 * @param {string} name - Nom d'utilisateur
 * @returns {boolean} Succès de l'opération
 */
function saveUserName(name) {
    if (!name || name.trim().length === 0) {
        return false;
    }
    
    const cleanName = name.trim().substring(0, 20); // Limiter à 20 caractères
    return saveData(STORAGE_KEYS.userName, cleanName);
}

/**
 * Récupère le nom d'utilisateur
 * @returns {string} Nom d'utilisateur ou nom par défaut
 */
function getUserName() {
    return loadData(STORAGE_KEYS.userName, 'Joueur CODM');
}

// ===== PRÉFÉRENCES UTILISATEUR =====

/**
 * Sauvegarde les préférences utilisateur
 * @param {Object} preferences - Préférences
 * @returns {boolean} Succès de l'opération
 */
function saveUserPreferences(preferences) {
    const defaultPrefs = {
        soundEnabled: true,
        animationsEnabled: true,
        showExplanations: true,
        autoNextQuestion: false,
        theme: 'dark'
    };
    
    const mergedPrefs = { ...defaultPrefs, ...preferences };
    return saveData(STORAGE_KEYS.userPreferences, mergedPrefs);
}

/**
 * Récupère les préférences utilisateur
 * @returns {Object} Préférences utilisateur
 */
function getUserPreferences() {
    return loadData(STORAGE_KEYS.userPreferences, {
        soundEnabled: true,
        animationsEnabled: true,
        showExplanations: true,
        autoNextQuestion: false,
        theme: 'dark'
    });
}

// ===== UTILITAIRES ET MAINTENANCE =====

/**
 * Nettoie les données anciennes
 */
function performCleanup() {
    try {
        console.log('🧹 Nettoyage des données...');
        
        // Nettoyer l'historique ancien (> 30 jours)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        
        let history = loadData(STORAGE_KEYS.gameHistory, []);
        history = history.filter(entry => new Date(entry.date) > cutoffDate);
        saveData(STORAGE_KEYS.gameHistory, history);
        
        // Nettoyer les stats quotidiennes anciennes (> 7 jours)
        const weekCutoff = new Date();
        weekCutoff.setDate(weekCutoff.getDate() - 7);
        
        let dailyStats = loadData(STORAGE_KEYS.dailyStats, {});
        Object.keys(dailyStats).forEach(date => {
            if (new Date(date) < weekCutoff) {
                delete dailyStats[date];
            }
        });
        saveData(STORAGE_KEYS.dailyStats, dailyStats);
        
        // Marquer le dernier nettoyage
        saveData(STORAGE_KEYS.lastCleanup, Date.now());
        
        console.log('✅ Nettoyage terminé');
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    }
}

/**
 * Vérifie si un nettoyage est nécessaire
 */
function checkCleanupNeeded() {
    const lastCleanup = loadData(STORAGE_KEYS.lastCleanup, 0);
    const now = Date.now();
    
    if (now - lastCleanup > STORAGE_CONFIG.backupInterval) {
        performCleanup();
    }
}

/**
 * Exporte toutes les données utilisateur
 * @returns {Object} Données exportées
 */
function exportUserData() {
    const exportData = {
        version: STORAGE_CONFIG.dataVersion,
        exportDate: new Date().toISOString(),
        data: {}
    };
    
    // Exporter toutes les données importantes
    Object.values(STORAGE_KEYS).forEach(key => {
        const data = loadData(key, null);
        if (data !== null) {
            exportData.data[key] = data;
        }
    });
    
    return exportData;
}

/**
 * Importe des données utilisateur
 * @param {Object} importData - Données à importer
 * @returns {boolean} Succès de l'importation
 */
function importUserData(importData) {
    try {
        if (!importData.data || typeof importData.data !== 'object') {
            throw new Error('Format de données invalide');
        }
        
        // Importer toutes les données
        Object.entries(importData.data).forEach(([key, value]) => {
            saveData(key, value);
        });
        
        console.log('✅ Données importées avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error);
        return false;
    }
}

/**
 * Remet à zéro toutes les données
 * @param {boolean} confirm - Confirmation de suppression
 * @returns {boolean} Succès de l'opération
 */
function resetAllData(confirm = false) {
    if (!confirm) {
        console.warn('⚠️ Confirmation requise pour reset');
        return false;
    }
    
    try {
        // Supprimer toutes les clés
        Object.values(STORAGE_KEYS).forEach(key => {
            removeData(key);
        });
        
        // Réinitialiser la date d'installation
        saveData(STORAGE_KEYS.installDate, new Date().toISOString());
        
        console.log('🔄 Toutes les données ont été supprimées');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors du reset:', error);
        return false;
    }
}

// ===== EXPOSITION GLOBALE =====

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Fonctions principales
        saveScore,
        getLeaderboard,
        getGameHistory,
        getUserStats,
        getPersonalBest,
        getDailyStats,
        
        // Gestion utilisateur
        saveUserName,
        getUserName,
        saveUserPreferences,
        getUserPreferences,
        
        // Maintenance
        performCleanup,
        exportUserData,
        importUserData,
        resetAllData,
        
        // Base
        saveData,
        loadData,
        removeData
    };
}

// Rendre disponible globalement
window.QuizStorage = {
    saveScore,
    getLeaderboard,
    getGameHistory,
    getUserStats,
    getPersonalBest,
    getDailyStats,
    saveUserName,
    getUserName,
    saveUserPreferences,
    getUserPreferences,
    exportUserData,
    importUserData,
    resetAllData
};

// ===== INITIALISATION =====

// Initialiser le stockage au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('💾 Initialisation du stockage...');
    
    // Vérifier si c'est la première visite
    const installDate = loadData(STORAGE_KEYS.installDate, null);
    if (!installDate) {
        saveData(STORAGE_KEYS.installDate, new Date().toISOString());
        console.log('🎉 Première visite détectée');
    }
    
    // Vérifier si nettoyage nécessaire
    if (STORAGE_CONFIG.autoCleanup) {
        checkCleanupNeeded();
    }
    
    // Afficher les statistiques de stockage
    const stats = getUserStats();
    console.log('📊 Stats utilisateur:', {
        totalGames: stats.totalGames,
        bestScore: stats.bestScore,
        averageScore: stats.averageScore
    });
    
    console.log('✅ Stockage initialisé');
});

console.log('💾 Quiz CODM - Système de stockage chargé');
