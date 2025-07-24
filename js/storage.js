// ===== STORAGE.JS - GESTION LOCALSTORAGE QUIZ CODM =====

// ===== CONSTANTES DE STOCKAGE =====
const STORAGE_KEYS = {
    USER_DATA: 'quizCODM_userData',
    QUIZ_HISTORY: 'quizCODM_quizHistory',
    LEADERBOARD: 'quizCODM_leaderboard',
    REFERRALS: 'quizCODM_referrals',
    SETTINGS: 'quizCODM_settings',
    PARTICIPATION: 'quizCODM_participation',
    ANALYTICS: 'quizCODM_analytics'
};

// Limites de stockage
const STORAGE_LIMITS = {
    MAX_QUIZ_HISTORY: 100,
    MAX_LEADERBOARD_ENTRIES: 50,
    MAX_REFERRALS: 1000,
    MAX_STORAGE_SIZE: 5 * 1024 * 1024 // 5MB
};

// ===== CLASSE PRINCIPALE DE GESTION DU STOCKAGE =====
class QuizStorage {
    constructor() {
        this.isSupported = this.checkStorageSupport();
        this.version = '1.0.0';
        this.initializeStorage();
    }

    // ===== VÉRIFICATION DU SUPPORT =====
    checkStorageSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('❌ localStorage non supporté:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.unavailable);
            return false;
        }
    }

    // ===== INITIALISATION =====
    initializeStorage() {
        if (!this.isSupported) {
            console.warn('⚠️ Stockage local non disponible - Mode dégradé');
            showStorageErrorNotification(STORAGE_MESSAGES.unavailable);
            return;
        }

        try {
            // Migration des données si nécessaire
            this.migrateData();
            // Initialisation des structures de base
            this.ensureDataStructures();
            // Nettoyage périodique
            this.performMaintenance();
            console.log('✅ Système de stockage initialisé');
        } catch (error) {
            console.error('❌ Erreur initialisation stockage:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
        }
    }

    // ===== GESTION DES DONNÉES UTILISATEUR =====
    
    /**
     * Initialise les données utilisateur par défaut
     * @returns {Object} Données utilisateur par défaut
     */
    createDefaultUserData() {
        const now = new Date();
        return {
            // Identité
            userId: this.generateUserId(),
            username: null,
            email: null,
            createdAt: now.toISOString(),
            lastActiveDate: now.toISOString(),
            
            // Quiz
            lastPlayDate: null,
            todayScore: 0,
            totalQuizzes: 0,
            bestScore: 0,
            averageScore: 0,
            perfectScores: 0,
            
            // Système de tickets
            totalTickets: 0,
            ticketsEarned: 0,
            ticketsFromShares: 0,
            ticketsFromReferrals: 0,
            
            // Participation
            hasParticipated: false,
            participationDate: null,
            monthlyParticipations: 0,
            
            // Parrainage
            referralCode: this.generateReferralCode(),
            referralsCount: 0,
            referredBy: null,
            
            // Préférences
            settings: this.createDefaultSettings(),
            
            // Version des données
            dataVersion: this.version
        };
    }

    /**
     * Sauvegarde les données utilisateur
     * @param {Object} userData - Données utilisateur à sauvegarder
     * @returns {boolean} Succès de la sauvegarde
     */
    saveUserData(userData) {
        try {
            if (!userData) return false;

            // Validation des données
            const validatedData = this.validateUserData(userData);
            
            // Mise à jour de la date de dernière activité
            validatedData.lastActiveDate = new Date().toISOString();
            
            // Sauvegarde sécurisée
            return this.secureSet(STORAGE_KEYS.USER_DATA, validatedData);
        } catch (error) {
            console.error('❌ Erreur sauvegarde données utilisateur:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Charge les données utilisateur
     * @returns {Object} Données utilisateur ou données par défaut
     */
    loadUserData() {
        try {
            const userData = this.secureGet(STORAGE_KEYS.USER_DATA);
            
            if (!userData) {
                const defaultData = this.createDefaultUserData();
                this.saveUserData(defaultData);
                return defaultData;
            }

            // Vérification de la migration nécessaire
            if (userData.dataVersion !== this.version) {
                return this.migrateUserData(userData);
            }

            return userData;
        } catch (error) {
            console.error('❌ Erreur chargement données utilisateur:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return this.createDefaultUserData();
        }
    }

    // ===== HISTORIQUE DES QUIZ =====
    
    /**
     * Sauvegarde un résultat de quiz
     * @param {Object} quizResult - Résultat du quiz
     * @returns {boolean} Succès de la sauvegarde
     */
    saveQuizResult(quizResult) {
        try {
            const history = this.getQuizHistory();
            const result = {
                id: this.generateId(),
                date: new Date().toISOString(),
                score: quizResult.score,
                totalQuestions: quizResult.totalQuestions,
                timeSpent: quizResult.timeSpent || null,
                questions: quizResult.questions || [],
                answers: quizResult.answers || [],
                difficulty: quizResult.difficulty || 'mixed'
            };

            // Ajout au début de l'historique
            history.unshift(result);
            
            // Limitation du nombre d'entrées
            if (history.length > STORAGE_LIMITS.MAX_QUIZ_HISTORY) {
                history.splice(STORAGE_LIMITS.MAX_QUIZ_HISTORY);
            }

            this.secureSet(STORAGE_KEYS.QUIZ_HISTORY, history);
            
            // Mise à jour des statistiques utilisateur
            this.updateUserStats(result);
            
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde résultat quiz:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Récupère l'historique des quiz
     * @param {number} limit - Nombre de résultats à retourner
     * @returns {Array} Historique des quiz
     */
    getQuizHistory(limit = null) {
        const history = this.secureGet(STORAGE_KEYS.QUIZ_HISTORY) || [];
        return limit ? history.slice(0, limit) : history;
    }

    // ===== SYSTÈME DE TICKETS =====
    
    /**
     * Ajoute des tickets à l'utilisateur
     * @param {number} amount - Nombre de tickets à ajouter
     * @param {string} source - Source des tickets (quiz, share, referral)
     * @returns {number} Nombre total de tickets
     */
    addTickets(amount, source = 'quiz') {
        if (!Number.isInteger(amount) || amount <= 0) {
            console.warn('⚠️ Ajout de tickets invalide:', amount);
            return this.getTickets(); // Retourne le nombre actuel de tickets
        }

        try {
            const userData = this.loadUserData();
            
            userData.totalTickets += amount;
            userData.ticketsEarned += amount;
            
            // Suivi par source
            switch (source) {
                case 'share':
                    userData.ticketsFromShares += amount;
                    break;
                case 'referral':
                    userData.ticketsFromReferrals += amount;
                    break;
                default:
                    console.warn('⚠️ Source de tickets inconnue:', source);
                    break;
            }

            this.saveUserData(userData);
            
            // Log de l'activité
            this.logActivity('tickets_earned', { amount, source });
            
            return userData.totalTickets;
        } catch (error) {
            console.error('❌ Erreur ajout tickets:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return this.getTickets(); // Retourne le nombre actuel de tickets
        }
    }

    /**
     * Récupère le nombre de tickets de l'utilisateur
     * @returns {number} Nombre de tickets
     */
    getTickets() {
        const userData = this.loadUserData();
        return userData.totalTickets || 0;
    }

    // ===== SYSTÈME DE PARRAINAGE =====
    
    /**
     * Enregistre un nouveau parrainage
     * @param {string} referrerCode - Code du parrain
     * @param {string} newUserCode - Code du nouveau utilisateur
     * @returns {boolean} Succès de l'enregistrement du parrainage
     */
    recordReferral(referrerCode, newUserCode) {
        if (!referrerCode || !newUserCode) {
            console.warn('⚠️ Codes de parrainage invalides');
            return false;
        }

        try {
            const referrals = this.secureGet(STORAGE_KEYS.REFERRALS) || [];

            // Vérification si le parrainage existe déjà
            if (referrals.some(ref => ref.referrerCode === referrerCode && ref.newUserCode === newUserCode)) {
                console.warn('⚠️ Ce parrainage existe déjà');
                return false;
            }
            
            const referral = {
                id: this.generateId(),
                referrerCode,
                newUserCode,
                date: new Date().toISOString(),
                status: 'completed'
            };

            referrals.push(referral);
            
            // Limitation du nombre de parrainages
            if (referrals.length > STORAGE_LIMITS.MAX_REFERRALS) {
                referrals.shift();
            }

            this.secureSet(STORAGE_KEYS.REFERRALS, referrals);
            
            // Ajout des tickets bonus au parrain si c'est l'utilisateur actuel
            const userData = this.loadUserData();
            if (userData.referralCode === referrerCode) {
                this.addTickets(1, 'referral');
                userData.referralsCount++;
                this.saveUserData(userData);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erreur enregistrement parrainage:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Récupère les parrainages de l'utilisateur
     * @returns {Array} Liste des parrainages
     */
    getUserReferrals() {
        const userData = this.loadUserData();
        const referrals = this.secureGet(STORAGE_KEYS.REFERRALS) || [];
        
        return referrals.filter(ref => ref.referrerCode === userData.referralCode);
    }

    // ===== CLASSEMENT =====
    
    /**
     * Met à jour le classement avec un nouveau score
     * @param {Object} scoreData - Données du score
     * @returns {boolean} Succès de la mise à jour du classement
     */
    updateLeaderboard(scoreData) {
        if (!scoreData || !Number.isInteger(scoreData.score)) {
            console.warn('⚠️ Données de score invalides pour le classement');
            return false;
        }

        try {
            const leaderboard = this.secureGet(STORAGE_KEYS.LEADERBOARD) || [];
            const userData = this.loadUserData();
            
            const entry = {
                id: userData.userId,
                username: userData.username || 'Joueur anonyme',
                score: scoreData.score,
                totalQuestions: scoreData.totalQuestions,
                date: new Date().toISOString(),
                month: new Date().toISOString().substring(0, 7) // YYYY-MM
            };

            // Recherche d'une entrée existante pour ce mois
            const currentMonth = new Date().toISOString().substring(0, 7);
            const existingIndex = leaderboard.findIndex(
                item => item.id === userData.userId && item.month === currentMonth
            );

            if (existingIndex >= 0) {
                // Mise à jour si meilleur score
                if (scoreData.score > leaderboard[existingIndex].score) {
                    leaderboard[existingIndex] = entry;
                } else {
                    return false; // Pas de mise à jour car le score n'est pas meilleur
                }
            } else {
                // Nouvelle entrée
                leaderboard.push(entry);
            }

            // Tri par score décroissant
            leaderboard.sort((a, b) => b.score - a.score);
            
            // Limitation du nombre d'entrées
            if (leaderboard.length > STORAGE_LIMITS.MAX_LEADERBOARD_ENTRIES) {
                leaderboard.splice(STORAGE_LIMITS.MAX_LEADERBOARD_ENTRIES);
            }

            this.secureSet(STORAGE_KEYS.LEADERBOARD, leaderboard);
            return true;
        } catch (error) {
            console.error('❌ Erreur mise à jour classement:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Récupère le classement mensuel
     * @param {number} limit - Nombre d'entrées à retourner
     * @returns {Array} Classement mensuel
     */
    getMonthlyLeaderboard(limit = 10) {
        const leaderboard = this.secureGet(STORAGE_KEYS.LEADERBOARD) || [];
        const currentMonth = new Date().toISOString().substring(0, 7);
        
        return leaderboard
            .filter(entry => entry.month === currentMonth)
            .slice(0, limit);
    }

    // ===== PARTICIPATION AU TIRAGE =====
    
    /**
     * Enregistre la participation au tirage mensuel
     * @param {Object} participationData - Données de participation
     * @returns {boolean} Succès de l'enregistrement de la participation
     */
    recordParticipation(participationData) {
        if (!participationData || !participationData.username || !participationData.email) {
            console.warn('⚠️ Données de participation incomplètes');
            return false;
        }

        try {
            const userData = this.loadUserData();

            // Vérification si l'utilisateur a déjà participé ce mois-ci
            if (userData.hasParticipated && userData.participationDate &&
                userData.participationDate.substring(0, 7) === new Date().toISOString().substring(0, 7)) {
                console.warn('⚠️ L\'utilisateur a déjà participé ce mois-ci');
                return false;
            }

            const participation = {
                id: this.generateId(),
                userId: userData.userId,
                username: participationData.username,
                email: participationData.email,
                date: new Date().toISOString(),
                month: new Date().toISOString().substring(0, 7),
                tickets: userData.totalTickets,
                gdprConsent: true
            };

            // Sauvegarde des données de participation
            this.secureSet(STORAGE_KEYS.PARTICIPATION, participation);
            
            // Mise à jour des données utilisateur
            userData.hasParticipated = true;
            userData.participationDate = participation.date;
            userData.monthlyParticipations++;
            userData.username = participationData.username;
            userData.email = participationData.email;
            
            this.saveUserData(userData);
            
            return true;
        } catch (error) {
            console.error('❌ Erreur enregistrement participation:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Récupère les données de participation
     * @returns {Object|null} Données de participation
     */
    getParticipation() {
        return this.secureGet(STORAGE_KEYS.PARTICIPATION);
    }

    // ===== ANALYTICS ET STATISTIQUES =====
    
    /**
     * Enregistre une activité utilisateur
     * @param {string} action - Type d'action
     * @param {Object} data - Données associées
     */
    logActivity(action, data = {}) {
        if (!action) {
            console.warn('⚠️ Action d\'activité non spécifiée');
            return;
        }

        try {
            const analytics = this.secureGet(STORAGE_KEYS.ANALYTICS) || [];
            
            const activity = {
                id: this.generateId(),
                action,
                data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent.substring(0, 100) // Limité pour la vie privée
            };

            analytics.push(activity);
            
            // Limitation de l'historique (30 derniers jours)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const filteredAnalytics = analytics.filter(
                item => new Date(item.timestamp) > thirtyDaysAgo
            );

            this.secureSet(STORAGE_KEYS.ANALYTICS, filteredAnalytics);
        } catch (error) {
            console.error('❌ Erreur log activité:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
        }
    }

    /**
     * Récupère les statistiques d'utilisation
     * @returns {Object} Statistiques
     */
    getAnalytics() {
        try {
            const analytics = this.secureGet(STORAGE_KEYS.ANALYTICS) || [];
            const userData = this.loadUserData();
            const quizHistory = this.getQuizHistory();
            
            const totalScores = quizHistory.reduce((acc, quiz) => acc + quiz.score, 0);
            const averageScore = quizHistory.length > 0 ? totalScores / quizHistory.length : 0;

            return {
                totalActivities: analytics.length,
                totalQuizzes: userData.totalQuizzes,
                bestScore: userData.bestScore,
                averageScore: averageScore,
                perfectScores: userData.perfectScores,
                totalTickets: userData.totalTickets,
                referralsCount: userData.referralsCount,
                accountAge: this.calculateAccountAge(userData.createdAt),
                lastActivity: userData.lastActiveDate
            };
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des analytics:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return {
                totalActivities: 0,
                totalQuizzes: 0,
                bestScore: 0,
                averageScore: 0,
                perfectScores: 0,
                totalTickets: 0,
                referralsCount: 0,
                accountAge: 0,
                lastActivity: null
            };
        }
    }

    // ===== FONCTIONS UTILITAIRES =====
    
    /**
     * Sauvegarde sécurisée avec gestion d'erreurs
     * @param {string} key - Clé de stockage
     * @param {*} data - Données à sauvegarder
     * @returns {boolean} Succès de la sauvegarde
     */
    secureSet(key, data) {
        if (!this.isSupported) return false;
        
        try {
            const serializedData = JSON.stringify(data);
            
            // Vérification de la taille
            if (serializedData.length > STORAGE_LIMITS.MAX_STORAGE_SIZE) {
                console.warn('⚠️ Données trop volumineuses pour le stockage');
                showStorageErrorNotification(STORAGE_MESSAGES.quota);
                return false;
            }
            
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ Quota de stockage dépassé - Nettoyage en cours...');
                this.performCleanup();
                // Nouvelle tentative après nettoyage
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    return true;
                } catch (retryError) {
                    console.error('❌ Impossible de sauvegarder après nettoyage:', retryError);
                    showStorageErrorNotification(STORAGE_MESSAGES.error);
                    return false;
                }
            }
            console.error('❌ Erreur sauvegarde sécurisée:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    /**
     * Chargement sécurisé avec gestion d'erreurs
     * @param {string} key - Clé de stockage
     * @returns {*} Données chargées ou null
     */
    secureGet(key) {
        if (!this.isSupported) return null;
        
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erreur chargement sécurisé:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return null;
        }
    }

    /**
     * Suppression sécurisée
     * @param {string} key - Clé de stockage
     * @returns {boolean} Succès de la suppression
     */
    secureRemove(key) {
        if (!this.isSupported) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('❌ Erreur suppression sécurisée:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
            return false;
        }
    }

    // ===== GÉNÉRATION D'IDENTIFIANTS =====
    
    /**
     * Génère un ID utilisateur unique
     * @returns {string} ID utilisateur
     */
    generateUserId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8);
        return `user_${timestamp}_${random}`;
    }

    /**
     * Génère un code de parrainage
     * @returns {string} Code de parrainage
     */
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Génère un ID générique
     * @returns {string} ID unique
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // ===== VALIDATION ET MIGRATION =====
    
    /**
     * Valide les données utilisateur
     * @param {Object} userData - Données à valider
     * @returns {Object} Données validées
     */
    validateUserData(userData) {
        const validated = { ...userData };
        
        // Validation des champs critiques
        validated.totalTickets = Math.max(0, parseInt(validated.totalTickets) || 0);
        validated.totalQuizzes = Math.max(0, parseInt(validated.totalQuizzes) || 0);
        validated.bestScore = Math.max(0, parseInt(validated.bestScore) || 0);
        validated.referralsCount = Math.max(0, parseInt(validated.referralsCount) || 0);
        
        // Validation des chaînes
        if (validated.username && typeof validated.username === 'string') {
            validated.username = validated.username.trim().substring(0, 50);
        }
        
        if (validated.email && typeof validated.email === 'string') {
            validated.email = validated.email.trim().toLowerCase();
        }
        
        return validated;
    }

    /**
     * Migre les données vers une nouvelle version
     * @param {Object} oldData - Anciennes données
     * @returns {Object} Données migrées
     */
    migrateUserData(oldData) {
        console.log('🔄 Migration des données utilisateur...');
        
        const defaultData = this.createDefaultUserData();
        const migratedData = { ...defaultData, ...oldData };
        
        // Mise à jour de la version
        migratedData.dataVersion = this.version;
        
        // Sauvegarde des données migrées
        this.saveUserData(migratedData);
        
        console.log('✅ Migration terminée');
        return migratedData;
    }

    // ===== MAINTENANCE ET NETTOYAGE =====
    
    /**
     * Effectue la maintenance périodique
     */
    performMaintenance() {
        try {
            // Nettoyage des données obsolètes
            this.cleanupOldData();
            
            // Vérification de l'intégrité
            this.validateDataIntegrity();
            
            // Optimisation de l'espace
            this.optimizeStorage();
            
            console.log('🧹 Maintenance du stockage terminée');
        } catch (error) {
            console.error('❌ Erreur durant la maintenance:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
        }
    }

    /**
     * Nettoyage d'urgence en cas de quota dépassé
     */
    performCleanup() {
        try {
            console.log('🧹 Nettoyage d\'urgence du stockage...');
            
            // Suppression des anciennes analytics
            const analytics = this.secureGet(STORAGE_KEYS.ANALYTICS) || [];
            const recentAnalytics = analytics.slice(-50); // Garde seulement les 50 dernières
            this.secureSet(STORAGE_KEYS.ANALYTICS, recentAnalytics);
            
            // Nettoyage de l'historique
            const history = this.getQuizHistory();
            const recentHistory = history.slice(0, 50); // Garde seulement les 50 derniers
            this.secureSet(STORAGE_KEYS.QUIZ_HISTORY, recentHistory);
            
            console.log('✅ Nettoyage d\'urgence terminé');
        } catch (error) {
            console.error('❌ Erreur durant le nettoyage:', error);
            showStorageErrorNotification(STORAGE_MESSAGES.error);
        }
    }

    // ===== FONCTIONS PRIVÉES SUPPLÉMENTAIRES =====
    
    createDefaultSettings() {
        return {
            notifications: true,
            soundEffects: true,
            animations: true,
            theme: 'default',
            language: 'fr'
        };
    }

    ensureDataStructures() {
        // Vérifie et initialise les structures de données nécessaires
        const keys = [
            STORAGE_KEYS.USER_DATA,
            STORAGE_KEYS.QUIZ_HISTORY,
            STORAGE_KEYS.LEADERBOARD,
            STORAGE_KEYS.REFERRALS,
            STORAGE_KEYS.ANALYTICS
        ];

        keys.forEach(key => {
            if (!this.secureGet(key)) {
                const defaultValue = key === STORAGE_KEYS.USER_DATA ? 
                    this.createDefaultUserData() : [];
                this.secureSet(key, defaultValue);
            }
        });
    }

    updateUserStats(quizResult) {
        const userData = this.loadUserData();
        
        // Mise à jour des statistiques
        userData.totalQuizzes++;
        userData.bestScore = Math.max(userData.bestScore, quizResult.score);
        
        if (quizResult.score === quizResult.totalQuestions) {
            userData.perfectScores++;
        }
        
        // Calcul de la moyenne
        userData.averageScore = this.calculateAverageScore();
        
        this.saveUserData(userData);
    }

    calculateAverageScore() {
        const history = this.getQuizHistory();
        if (history.length === 0) return 0;
        
        const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0);
        return Math.round((totalScore / history.length) * 100) / 100;
    }

    calculateAccountAge(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Jours
    }

    migrateData() {
        // Logique de migration pour les futures versions
    }

    cleanupOldData() {
        // Suppression des données obsolètes (plus de 6 mois)
    }

    validateDataIntegrity() {
        // Vérification de l'intégrité des données
    }

    optimizeStorage() {
        // Optimisation de l'espace de stockage
    }
}

// ===== MESSAGES D'ERREUR CENTRALISÉS =====
const STORAGE_MESSAGES = {
    error: "Erreur de stockage : vos données ne peuvent pas être enregistrées. Certaines fonctionnalités sont limitées.",
    unavailable: "Le stockage local est désactivé ou indisponible. Certaines fonctionnalités sont limitées.",
    quota: "Espace de stockage insuffisant. Veuillez libérer de l'espace pour continuer à utiliser le quiz."
};

// ===== NOTIFICATION ACCESSIBLE ERREUR STOCKAGE =====
function showStorageErrorNotification(message) {
    let notif = document.getElementById('storageErrorNotification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'storageErrorNotification';
        notif.className = 'storage-error-notification';
        notif.setAttribute('role', 'alert');
        notif.setAttribute('aria-live', 'assertive');
        notif.setAttribute('tabindex', '-1');
        document.body.appendChild(notif);
    }
    notif.innerHTML = `
        <span>${message}</span>
        <button class="close-storage-error" aria-label="Fermer la notification">&times;</button>
    `;
    notif.classList.add('active');
    notif.focus();
    function handleEscClose(e) {
        if (e.key === 'Escape') {
            notif.classList.remove('active');
            document.removeEventListener('keydown', handleEscClose);
        }
    }
    document.addEventListener('keydown', handleEscClose);
    const closeBtn = notif.querySelector('.close-storage-error');
    if (closeBtn) closeBtn.onclick = () => notif.classList.remove('active');
    setTimeout(() => {
        notif.classList.remove('active');
    }, 8000);
}

// ===== INSTANCE GLOBALE =====
const quizStorage = new QuizStorage();

// ===== EXPORT POUR UTILISATION =====
window.QuizStorage = {
    // Instance principale
    storage: quizStorage,
    
    // Méthodes rapides pour l'app
    saveUser: (data) => quizStorage.saveUserData(data),
    loadUser: () => quizStorage.loadUserData(),
    saveQuiz: (result) => quizStorage.saveQuizResult(result),
    addTickets: (amount, source) => quizStorage.addTickets(amount, source),
    getTickets: () => quizStorage.getTickets(),
    participate: (data) => quizStorage.recordParticipation(data),
    referral: (referrer, newUser) => quizStorage.recordReferral(referrer, newUser),
    leaderboard: (scoreData) => quizStorage.updateLeaderboard(scoreData),
    getLeaderboard: (limit) => quizStorage.getMonthlyLeaderboard(limit),
    analytics: () => quizStorage.getAnalytics(),
    
    // Utilitaires
    isSupported: () => quizStorage.isSupported,
    cleanup: () => quizStorage.performCleanup(),
    
    // Pour debug
    keys: STORAGE_KEYS,
    limits: STORAGE_LIMITS
};

console.log('💾 Storage.js chargé! Système de persistance prêt');
