// ===== REFERRAL.JS - SYSTÈME DE PARRAINAGE QUIZ CODM =====

// ===== CONSTANTES DE PARRAINAGE =====
const REFERRAL_CONFIG = {
    // Configuration des tickets et récompenses
    REWARDS: {
        NEW_REFERRAL: 2,        // Tickets pour le parrain
        WELCOME_BONUS: 1,       // Bonus pour le nouveau joueur
        MONTHLY_BONUS: 5,       // Bonus si 5+ parrainages dans le mois
        PERFECT_SCORE_BONUS: 1  // Bonus si le filleul fait 10/10
    },
    
    // Limites et validation
    LIMITS: {
        MAX_MONTHLY_REFERRALS: 50,   // Limite anti-abuse
        MIN_REFERRAL_SCORE: 3,       // Score minimum du filleul pour valider
        VALIDATION_DELAY: 24 * 60 * 60 * 1000, // 24h pour valider
        COOLDOWN_BETWEEN_SAME_IP: 60 * 60 * 1000 // 1h entre refs même IP
    },
    
    // Messages de notification
    MESSAGES: {
        welcome_referee: "🎉 Bienvenue ! Tu as été parrainé par {referrer} et gagnes +{bonus} ticket de bienvenue !",
        new_referral: "🎊 Nouveau filleul ! {referee} a rejoint grâce à toi. +{reward} tickets !",
        referral_completed: "✅ Ton filleul {referee} a terminé son premier quiz ! +{bonus} tickets bonus !",
        monthly_achievement: "🏆 5+ parrainages ce mois ! Bonus de {bonus} tickets débloqué !",
        perfect_score_bonus: "⭐ Ton filleul {referee} a fait 10/10 ! +{bonus} ticket bonus !"
    }
};

// ===== CLASSE PRINCIPALE DE PARRAINAGE =====
class ReferralManager {
    constructor() {
        this.currentUserCode = null;
        this.referredBy = null;
        this.monthlyReferrals = 0;
        this.totalReferrals = 0;
        this.pendingReferrals = [];
        this.validatedReferrals = [];
        
        this.init();
    }

    // ===== INITIALISATION =====
    init() {
        this.loadReferralData();
        this.checkUrlForReferralCode();
        this.setupEventListeners();
        this.validatePendingReferrals();
        
        console.log('✅ Système de parrainage initialisé');
    }

    // ===== CHARGEMENT DES DONNÉES DE PARRAINAGE =====
    loadReferralData() {
        try {
            // Chargement des données utilisateur principales
            const userData = window.QuizStorage?.loadUserData() || {};
            this.currentUserCode = userData.referralCode || this.generateReferralCode();
            this.referredBy = userData.referredBy || null;
            this.totalReferrals = userData.referralsCount || 0;

            // Chargement des données de parrainage spécifiques
            const referralData = this.loadReferralStorage();
            this.monthlyReferrals = referralData.monthlyReferrals || 0;
            this.pendingReferrals = referralData.pendingReferrals || [];
            this.validatedReferrals = referralData.validatedReferrals || [];

            // Vérification du reset mensuel
            this.checkMonthlyReset(referralData);

        } catch (error) {
            console.error('❌ Erreur chargement données parrainage:', error);
            this.initializeDefaultData();
        }
    }

    // ===== CHARGEMENT DU STOCKAGE PARRAINAGE =====
    loadReferralStorage() {
        try {
            const stored = localStorage.getItem('quizCODM_referralData');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('❌ Erreur parsing données parrainage:', error);
            return {};
        }
    }

    // ===== SAUVEGARDE DES DONNÉES DE PARRAINAGE =====
    saveReferralData() {
        try {
            const referralData = {
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                monthlyReferrals: this.monthlyReferrals,
                pendingReferrals: this.pendingReferrals,
                validatedReferrals: this.validatedReferrals,
                lastUpdate: Date.now()
            };

            localStorage.setItem('quizCODM_referralData', JSON.stringify(referralData));
            
            // Mise à jour des données utilisateur principales
            if (window.QuizStorage) {
                const userData = window.QuizStorage.loadUserData();
                userData.referralCode = this.currentUserCode;
                userData.referredBy = this.referredBy;
                userData.referralsCount = this.totalReferrals;
                window.QuizStorage.saveUserData(userData);
            }

        } catch (error) {
            console.error('❌ Erreur sauvegarde données parrainage:', error);
        }
    }

    // ===== VÉRIFICATION DU RESET MENSUEL =====
    checkMonthlyReset(referralData) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        if (referralData.month !== currentMonth || referralData.year !== currentYear) {
            // Nouveau mois - reset des compteurs mensuels
            this.monthlyReferrals = 0;
            this.pendingReferrals = []; // Reset des pending (expirés)
            console.log('🔄 Reset mensuel du système de parrainage');
        }
    }

    // ===== GÉNÉRATION DE CODE DE PARRAINAGE =====
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'REF';
        for (let i = 0; i < 7; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // ===== VÉRIFICATION DU CODE DANS L'URL =====
    checkUrlForReferralCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode && referralCode !== this.currentUserCode) {
            this.handleIncomingReferral(referralCode);
        }
    }

    // ===== GESTION D'UN PARRAINAGE ENTRANT =====
    handleIncomingReferral(referrerCode) {
        // Vérifier si l'utilisateur est déjà parrainé
        if (this.referredBy) {
            console.log('ℹ️ Utilisateur déjà parrainé, ignorer le nouveau code');
            return;
        }

        // Vérifier que ce n'est pas son propre code
        if (referrerCode === this.currentUserCode) {
            console.log('⚠️ Tentative de self-referral ignorée');
            return;
        }

        // Vérification des limites anti-abuse
        if (!this.validateIncomingReferral(referrerCode)) {
            return;
        }

        // Enregistrer le parrainage
        this.referredBy = referrerCode;
        this.processNewReferee(referrerCode);
        
        console.log(`✅ Parrainage enregistré de ${referrerCode}`);
    }

    // ===== VALIDATION DU PARRAINAGE ENTRANT =====
    validateIncomingReferral(referrerCode) {
        // Vérifier le format du code
        if (!/^[A-Z0-9]{3,15}$/.test(referrerCode)) {
            console.warn('⚠️ Format de code de parrainage invalide');
            return false;
        }

        // Vérification anti-spam par IP (simulation)
        const userIP = this.getSimulatedUserIP();
        const recentReferrals = this.pendingReferrals.filter(ref => 
            ref.refereeIP === userIP && 
            (Date.now() - ref.timestamp) < REFERRAL_CONFIG.LIMITS.COOLDOWN_BETWEEN_SAME_IP
        );

        if (recentReferrals.length > 0) {
            console.warn('⚠️ Cooldown entre parrainages depuis la même IP');
            return false;
        }

        return true;
    }

    // ===== TRAITEMENT D'UN NOUVEAU FILLEUL =====
    processNewReferee(referrerCode) {
        try {
            // Créer l'entrée de parrainage en attente
            const referralEntry = {
                id: this.generateReferralId(),
                referrerCode: referrerCode,
                refereeCode: this.currentUserCode,
                timestamp: Date.now(),
                status: 'pending',
                refereeIP: this.getSimulatedUserIP(),
                validationDeadline: Date.now() + REFERRAL_CONFIG.LIMITS.VALIDATION_DELAY
            };

            // Ajouter aux parrainages en attente
            this.pendingReferrals.push(referralEntry);

            // Donner le bonus de bienvenue au filleul
            this.giveWelcomeBonus();

            // Notifier le système de parrainage au parrain
            this.notifyReferrer(referrerCode, 'new_referral');

            this.saveReferralData();

        } catch (error) {
            console.error('❌ Erreur traitement nouveau filleul:', error);
        }
    }

    // ===== BONUS DE BIENVENUE POUR LE FILLEUL =====
    giveWelcomeBonus() {
        if (window.QuizStorage && window.QuizStorage.addTickets) {
            const tickets = window.QuizStorage.addTickets(
                REFERRAL_CONFIG.REWARDS.WELCOME_BONUS, 
                'referral'
            );
            
            this.showNotification(
                REFERRAL_CONFIG.MESSAGES.welcome_referee
                    .replace('{referrer}', this.referredBy)
                    .replace('{bonus}', REFERRAL_CONFIG.REWARDS.WELCOME_BONUS),
                'success'
            );
        }
    }

    // ===== NOTIFICATION AU PARRAIN =====
    notifyReferrer(referrerCode, eventType, data = {}) {
        // Dans un vrai système, on enverrait une notification au parrain
        // Ici on simule avec des logs et du stockage local
        
        const notification = {
            id: this.generateNotificationId(),
            type: eventType,
            referrerCode: referrerCode,
            timestamp: Date.now(),
            data: data
        };

        // Stocker la notification pour affichage si le parrain visite
        this.storeNotificationForUser(referrerCode, notification);
    }

    // ===== STOCKAGE DE NOTIFICATION POUR UTILISATEUR =====
    storeNotificationForUser(userCode, notification) {
        try {
            const key = `quizCODM_notifications_${userCode}`;
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(notification);
            
            // Garder seulement les 10 dernières notifications
            if (existing.length > 10) {
                existing.splice(0, existing.length - 10);
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
        } catch (error) {
            console.error('❌ Erreur stockage notification:', error);
        }
    }

    // ===== VALIDATION DES PARRAINAGES EN ATTENTE =====
    validatePendingReferrals() {
        if (!window.QuizStorage) return;

        const userData = window.QuizStorage.loadUserData();
        const userHasCompletedQuiz = userData.totalQuizzes > 0;

        // Si l'utilisateur actuel a des parrainages en attente et a terminé un quiz
        if (this.referredBy && userHasCompletedQuiz) {
            this.validateOwnReferral(userData);
        }

        // Nettoyer les parrainages expirés
        this.cleanupExpiredReferrals();
    }

    // ===== VALIDATION DU PROPRE PARRAINAGE =====
    validateOwnReferral(userData) {
        const pendingReferral = this.pendingReferrals.find(ref => 
            ref.refereeCode === this.currentUserCode && 
            ref.status === 'pending'
        );

        if (!pendingReferral) return;

        // Vérifier les critères de validation
        const scoreThreshold = userData.bestScore >= REFERRAL_CONFIG.LIMITS.MIN_REFERRAL_SCORE;
        
        if (scoreThreshold) {
            // Valider le parrainage
            pendingReferral.status = 'validated';
            pendingReferral.validatedAt = Date.now();
            pendingReferral.refereeScore = userData.bestScore;

            // Déplacer vers les validés
            this.validatedReferrals.push(pendingReferral);
            this.pendingReferrals = this.pendingReferrals.filter(ref => ref.id !== pendingReferral.id);

            // Récompenser le parrain
            this.rewardReferrer(pendingReferral);

            console.log('✅ Parrainage validé avec succès');
        }
    }

    // ===== RÉCOMPENSE DU PARRAIN =====
    rewardReferrer(referralEntry) {
        // Créer une notification de récompense pour le parrain
        const rewardData = {
            refereeCode: referralEntry.refereeCode,
            reward: REFERRAL_CONFIG.REWARDS.NEW_REFERRAL,
            refereeScore: referralEntry.refereeScore
        };

        // Bonus supplémentaire si score parfait
        if (referralEntry.refereeScore === 10) {
            rewardData.perfectBonus = REFERRAL_CONFIG.REWARDS.PERFECT_SCORE_BONUS;
            rewardData.reward += REFERRAL_CONFIG.REWARDS.PERFECT_SCORE_BONUS;
        }

        // Notifier le parrain
        this.notifyReferrer(referralEntry.referrerCode, 'referral_completed', rewardData);

        // Si c'est l'utilisateur actuel qui est le parrain, donner les tickets directement
        if (referralEntry.referrerCode === this.currentUserCode) {
            this.processReferralReward(rewardData);
        }
    }

    // ===== TRAITEMENT DE LA RÉCOMPENSE DE PARRAINAGE =====
    processReferralReward(rewardData) {
        if (window.QuizStorage && window.QuizStorage.addTickets) {
            // Ajouter les tickets de base
            window.QuizStorage.addTickets(REFERRAL_CONFIG.REWARDS.NEW_REFERRAL, 'referral');
            
            let message = REFERRAL_CONFIG.MESSAGES.referral_completed
                .replace('{referee}', rewardData.refereeCode.slice(-4))
                .replace('{bonus}', REFERRAL_CONFIG.REWARDS.NEW_REFERRAL);

            // Bonus score parfait
            if (rewardData.perfectBonus) {
                window.QuizStorage.addTickets(rewardData.perfectBonus, 'referral');
                message += ' ' + REFERRAL_CONFIG.MESSAGES.perfect_score_bonus
                    .replace('{referee}', rewardData.refereeCode.slice(-4))
                    .replace('{bonus}', rewardData.perfectBonus);
            }

            this.showNotification(message, 'success');

            // Incrémenter les compteurs
            this.monthlyReferrals++;
            this.totalReferrals++;

            // Vérifier le bonus mensuel
            this.checkMonthlyBonus();

            this.saveReferralData();
        }
    }

    // ===== VÉRIFICATION DU BONUS MENSUEL =====
    checkMonthlyBonus() {
        if (this.monthlyReferrals >= 5) {
            const hasMonthlyBonus = this.validatedReferrals.some(ref => 
                ref.monthlyBonusGiven && 
                new Date(ref.validatedAt).getMonth() === new Date().getMonth()
            );

            if (!hasMonthlyBonus && window.QuizStorage && window.QuizStorage.addTickets) {
                window.QuizStorage.addTickets(REFERRAL_CONFIG.REWARDS.MONTHLY_BONUS, 'referral');
                
                this.showNotification(
                    REFERRAL_CONFIG.MESSAGES.monthly_achievement
                        .replace('{bonus}', REFERRAL_CONFIG.REWARDS.MONTHLY_BONUS),
                    'success'
                );

                // Marquer le bonus comme donné
                this.validatedReferrals.forEach(ref => {
                    if (new Date(ref.validatedAt).getMonth() === new Date().getMonth()) {
                        ref.monthlyBonusGiven = true;
                    }
                });

                this.saveReferralData();
            }
        }
    }

    // ===== NETTOYAGE DES PARRAINAGES EXPIRÉS =====
    cleanupExpiredReferrals() {
        const now = Date.now();
        const beforeCleanup = this.pendingReferrals.length;
        
        this.pendingReferrals = this.pendingReferrals.filter(ref => 
            ref.validationDeadline > now
        );

        const cleaned = beforeCleanup - this.pendingReferrals.length;
        if (cleaned > 0) {
            console.log(`🧹 ${cleaned} parrainages expirés nettoyés`);
            this.saveReferralData();
        }
    }

    // ===== CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS =====
    setupEventListeners() {
        // Bouton de copie du code de parrainage
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-referral-btn')) {
                this.copyReferralCode();
            }
        });

        // Mise à jour des statistiques de parrainage
        document.addEventListener('DOMContentLoaded', () => {
            this.updateReferralUI();
        });
    }

    // ===== COPIE DU CODE DE PARRAINAGE =====
    copyReferralCode() {
        const referralUrl = this.generateReferralUrl();
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(referralUrl).then(() => {
                this.showNotification('✅ Lien de parrainage copié !', 'success');
            }).catch(() => {
                this.fallbackCopyText(referralUrl);
            });
        } else {
            this.fallbackCopyText(referralUrl);
        }
    }

    // ===== GÉNÉRATION DE L'URL DE PARRAINAGE =====
    generateReferralUrl() {
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?ref=${this.currentUserCode}`;
    }

    // ===== COPIE FALLBACK =====
    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showNotification('✅ Lien de parrainage copié !', 'success');
        } catch (error) {
            this.showNotification('Impossible de copier automatiquement.', 'warning');
            prompt('Copiez ce lien :', text);
        } finally {
            textArea.remove();
        }
    }

    // ===== MISE À JOUR DE L'INTERFACE UTILISATEUR =====
    updateReferralUI() {
        // Code de parrainage
        const referralCodeElements = document.querySelectorAll('[data-referral-code]');
        referralCodeElements.forEach(el => {
            el.textContent = this.currentUserCode;
        });

        // URL de parrainage
        const referralUrlElements = document.querySelectorAll('[data-referral-url]');
        referralUrlElements.forEach(el => {
            el.value = this.generateReferralUrl();
        });

        // Statistiques de parrainage
        const statsElements = {
            monthlyReferrals: document.querySelector('[data-monthly-referrals]'),
            totalReferrals: document.querySelector('[data-total-referrals]'),
            pendingReferrals: document.querySelector('[data-pending-referrals]'),
            ticketsFromReferrals: document.querySelector('[data-tickets-referrals]')
        };

        if (statsElements.monthlyReferrals) {
            statsElements.monthlyReferrals.textContent = this.monthlyReferrals;
        }
        if (statsElements.totalReferrals) {
            statsElements.totalReferrals.textContent = this.totalReferrals;
        }
        if (statsElements.pendingReferrals) {
            statsElements.pendingReferrals.textContent = this.pendingReferrals.length;
        }
        if (statsElements.ticketsFromReferrals) {
            const userData = window.QuizStorage?.loadUserData() || {};
            statsElements.ticketsFromReferrals.textContent = userData.ticketsFromReferrals || 0;
        }
    }

    // ===== FONCTIONS UTILITAIRES =====
    
    generateReferralId() {
        return 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getSimulatedUserIP() {
        // Simulation d'IP pour le système de cooldown
        // En production, cela viendrait du serveur
        let simulatedIP = localStorage.getItem('quizCODM_simulatedIP');
        if (!simulatedIP) {
            simulatedIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            localStorage.setItem('quizCODM_simulatedIP', simulatedIP);
        }
        return simulatedIP;
    }

    initializeDefaultData() {
        this.currentUserCode = this.generateReferralCode();
        this.referredBy = null;
        this.monthlyReferrals = 0;
        this.totalReferrals = 0;
        this.pendingReferrals = [];
        this.validatedReferrals = [];
    }

    // ===== SYSTÈME DE NOTIFICATIONS =====
    showNotification(message, type = 'info') {
        let notification = document.getElementById('referralNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'referralNotification';
            notification.className = 'referral-notification';
            document.body.appendChild(notification);
        }

        notification.className = `referral-notification ${type} active`;
        notification.innerHTML = message;

        setTimeout(() => {
            notification.classList.remove('active');
        }, 6000);
    }

    // ===== MÉTHODES PUBLIQUES =====

    /**
     * Obtient les statistiques de parrainage
     * @returns {Object} Statistiques complètes
     */
    getReferralStats() {
        return {
            referralCode: this.currentUserCode,
            referralUrl: this.generateReferralUrl(),
            referredBy: this.referredBy,
            monthlyReferrals: this.monthlyReferrals,
            totalReferrals: this.totalReferrals,
            pendingReferrals: this.pendingReferrals.length,
            validatedReferrals: this.validatedReferrals.length,
            canReceiveBonus: this.monthlyReferrals < REFERRAL_CONFIG.LIMITS.MAX_MONTHLY_REFERRALS
        };
    }

    /**
     * Force la validation d'un parrainage (pour tests)
     * @param {string} referralId - ID du parrainage à valider
     */
    forceValidateReferral(referralId) {
        const referral = this.pendingReferrals.find(ref => ref.id === referralId);
        if (referral) {
            referral.status = 'validated';
            referral.validatedAt = Date.now();
            referral.refereeScore = 10;
            
            this.validatedReferrals.push(referral);
            this.pendingReferrals = this.pendingReferrals.filter(ref => ref.id !== referralId);
            
            this.rewardReferrer(referral);
            console.log('✅ Parrainage forcé validé');
        }
    }

    /**
     * Remet à zéro les données de parrainage (pour tests)
     */
    resetReferralData() {
        this.monthlyReferrals = 0;
        this.totalReferrals = 0;
        this.pendingReferrals = [];
        this.validatedReferrals = [];
        this.saveReferralData();
        this.updateReferralUI();
        console.log('🔄 Données de parrainage réinitialisées');
    }
}

// ===== INITIALISATION GLOBALE =====
window.ReferralManager = ReferralManager;

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.QuizStorage !== 'undefined') {
        window.quizReferral = new ReferralManager();
        console.log('✅ Système de parrainage activé');
    } else {
        setTimeout(() => {
            window.quizReferral = new ReferralManager();
            console.log('✅ Système de parrainage activé (délai)');
        }, 1000);
    }
});

// ===== FONCTIONS HELPER GLOBALES =====

/**
 * Copie le lien de parrainage
 */
window.copyReferralLink = function() {
    if (window.quizReferral) {
        window.quizReferral.copyReferralCode();
    } else {
        console.warn('⚠️ Système de parrainage non initialisé');
    }
};

/**
 * Obtient les stats de parrainage
 * @returns {Object} Statistiques de parrainage
 */
window.getReferralStats = function() {
    if (window.quizReferral) {
        return window.quizReferral.getReferralStats();
    }
    return null;
};

console.log('🤝 Module de parrainage chargé - Quiz CODM');