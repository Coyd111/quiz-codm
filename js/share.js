// ===== SHARE.JS - SYSTÈME DE PARTAGE SOCIAL QUIZ CODM =====

// ===== CONSTANTES DE PARTAGE =====
const SHARE_CONFIG = {
    // URLs des plateformes sociales
    PLATFORMS: {
        facebook: 'https://www.facebook.com/sharer/sharer.php',
        twitter: 'https://twitter.com/intent/tweet',
        whatsapp: 'https://wa.me/',
        telegram: 'https://t.me/share/url',
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
        messenger: 'fb-messenger://share'
    },
    
    // Messages de partage personnalisés
    MESSAGES: {
        default: "🎮 Je viens de faire {score}/10 au Quiz CODM ! Teste tes connaissances Call of Duty Mobile et gagne des cartes cadeaux ! 🎁",
        perfect: "🏆 PARFAIT ! 10/10 au Quiz CODM ! Je maîtrise Call of Duty Mobile ! À ton tour de relever le défi ! 🎮",
        good: "✨ {score}/10 au Quiz CODM ! Pas mal pour un fan de Call of Duty Mobile ! Peux-tu faire mieux ? 🎯",
        average: "🎮 {score}/10 au Quiz CODM ! J'apprends encore sur Call of Duty Mobile. À toi de jouer ! 💪"
    },
    
    // Configuration des tickets bonus
    TICKETS: {
        PER_SHARE: 1,
        COOLDOWN_MINUTES: 5, // Empêche le spam
        MAX_DAILY_SHARES: 10
    }
};

// ===== CLASSE PRINCIPALE DE PARTAGE =====
class ShareManager {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname;
        this.userReferralCode = null;
        this.dailyShares = 0;
        this.lastShareTime = null;
        
        this.init();
    }

    // ===== INITIALISATION =====
    init() {
        this.loadShareData();
        this.setupEventListeners();
        this.updateShareButtons();
        console.log('✅ Système de partage initialisé');
    }

    // ===== CHARGEMENT DES DONNÉES DE PARTAGE =====
    loadShareData() {
        try {
            const userData = window.QuizStorage?.loadUserData() || {};
            this.userReferralCode = userData.referralCode || this.generateReferralCode();
            
            const shareData = JSON.parse(localStorage.getItem('quizCODM_shareData') || '{}');
            const today = new Date().toDateString();
            
            // Réinitialisation quotidienne
            if (shareData.date !== today) {
                this.dailyShares = 0;
                this.lastShareTime = null;
                this.saveShareData();
            } else {
                this.dailyShares = shareData.dailyShares || 0;
                this.lastShareTime = shareData.lastShareTime || null;
            }
        } catch (error) {
            console.error('❌ Erreur chargement données partage:', error);
            this.dailyShares = 0;
            this.lastShareTime = null;
        }
    }

    // ===== SAUVEGARDE DES DONNÉES DE PARTAGE =====
    saveShareData() {
        try {
            const shareData = {
                date: new Date().toDateString(),
                dailyShares: this.dailyShares,
                lastShareTime: this.lastShareTime
            };
            localStorage.setItem('quizCODM_shareData', JSON.stringify(shareData));
        } catch (error) {
            console.error('❌ Erreur sauvegarde données partage:', error);
        }
    }

    // ===== GÉNÉRATION DE CODE DE PARRAINAGE =====
    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'CODM';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // ===== CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS =====
    setupEventListeners() {
        // Boutons de partage dans les résultats
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                e.preventDefault();
                const platform = e.target.dataset.platform;
                this.shareToSocial(platform);
            }
        });

        // Bouton de copie de lien
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyReferralLink());
        }

        // Bouton partage principal
        const shareScoreBtn = document.getElementById('shareScoreBtn');
        if (shareScoreBtn) {
            shareScoreBtn.addEventListener('click', () => this.openShareModal());
        }
    }

    // ===== MISE À JOUR DES BOUTONS DE PARTAGE =====
    updateShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        const canShare = this.canUserShare();

        shareButtons.forEach(btn => {
            if (!canShare.allowed) {
                btn.classList.add('disabled');
                btn.title = canShare.reason;
            } else {
                btn.classList.remove('disabled');
                btn.title = 'Partager pour gagner +1 ticket';
            }
        });

        // Mise à jour du compteur de partages
        const shareCounter = document.getElementById('dailySharesCount');
        if (shareCounter) {
            shareCounter.textContent = `${this.dailyShares}/${SHARE_CONFIG.TICKETS.MAX_DAILY_SHARES}`;
        }
    }

    // ===== VÉRIFICATION DES LIMITES DE PARTAGE =====
    canUserShare() {
        // Limite quotidienne
        if (this.dailyShares >= SHARE_CONFIG.TICKETS.MAX_DAILY_SHARES) {
            return {
                allowed: false,
                reason: 'Limite quotidienne de partages atteinte'
            };
        }

        // Cooldown entre partages
        if (this.lastShareTime) {
            const timeDiff = Date.now() - this.lastShareTime;
            const cooldownMs = SHARE_CONFIG.TICKETS.COOLDOWN_MINUTES * 60 * 1000;
            
            if (timeDiff < cooldownMs) {
                const remainingMinutes = Math.ceil((cooldownMs - timeDiff) / 60000);
                return {
                    allowed: false,
                    reason: `Attendre ${remainingMinutes}min avant le prochain partage`
                };
            }
        }

        return { allowed: true };
    }

    // ===== GÉNÉRATION DU MESSAGE DE PARTAGE =====
    generateShareMessage(score = null) {
        let message = SHARE_CONFIG.MESSAGES.default;

        // Personnalisation selon le score
        if (score !== null) {
            if (score === 10) {
                message = SHARE_CONFIG.MESSAGES.perfect;
            } else if (score >= 7) {
                message = SHARE_CONFIG.MESSAGES.good;
            } else if (score >= 5) {
                message = SHARE_CONFIG.MESSAGES.average;
            }
        }

        // Remplacement des variables
        message = message.replace('{score}', score || 'X');
        
        return message;
    }

    // ===== GÉNÉRATION DE L'URL DE PARTAGE =====
    generateShareUrl(platform = null) {
        let url = this.baseUrl;
        
        // Ajout du code de parrainage
        if (this.userReferralCode) {
            url += `?ref=${this.userReferralCode}`;
        }

        // Paramètres UTM pour tracking
        const utmParams = new URLSearchParams({
            utm_source: platform || 'share',
            utm_medium: 'social',
            utm_campaign: 'quiz_codm',
            utm_content: 'user_share'
        });

        url += (url.includes('?') ? '&' : '?') + utmParams.toString();
        return url;
    }

    // ===== PARTAGE VERS RÉSEAUX SOCIAUX =====
    shareToSocial(platform) {
        const canShare = this.canUserShare();
        if (!canShare.allowed) {
            this.showNotification(canShare.reason, 'warning');
            return;
        }

        const userData = window.QuizStorage?.loadUserData() || {};
        const score = userData.todayScore || null;
        const message = this.generateShareMessage(score);
        const shareUrl = this.generateShareUrl(platform);

        let finalUrl = '';

        switch (platform) {
            case 'facebook':
                finalUrl = `${SHARE_CONFIG.PLATFORMS.facebook}?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
                break;

            case 'twitter':
                finalUrl = `${SHARE_CONFIG.PLATFORMS.twitter}?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}&hashtags=CODM,CallofDutyMobile,Quiz`;
                break;

            case 'whatsapp':
                const whatsappMessage = `${message}\n\n${shareUrl}`;
                finalUrl = `${SHARE_CONFIG.PLATFORMS.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
                break;

            case 'telegram':
                finalUrl = `${SHARE_CONFIG.PLATFORMS.telegram}?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
                break;

            case 'linkedin':
                finalUrl = `${SHARE_CONFIG.PLATFORMS.linkedin}?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Quiz CODM')}&summary=${encodeURIComponent(message)}`;
                break;

            case 'messenger':
                finalUrl = `${SHARE_CONFIG.PLATFORMS.messenger}?link=${encodeURIComponent(shareUrl)}`;
                break;

            default:
                console.error('❌ Plateforme de partage inconnue:', platform);
                return;
        }

        // Ouverture de la fenêtre de partage
        this.openShareWindow(finalUrl, platform);
        
        // Enregistrement du partage
        this.recordShare(platform);
    }

    // ===== OUVERTURE DE LA FENÊTRE DE PARTAGE =====
    openShareWindow(url, platform) {
        const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes,status=yes';
        
        try {
            const shareWindow = window.open(url, `share_${platform}`, windowFeatures);
            
            if (!shareWindow) {
                // Fallback si popup bloqué
                this.showNotification('Popup bloqué ! Autoriser les popups ou copier le lien manuellement.', 'warning');
                this.copyReferralLink();
                return;
            }

            // Focus sur la fenêtre de partage
            shareWindow.focus();
            
            // Détection de fermeture pour validation du partage
            const checkClosed = setInterval(() => {
                if (shareWindow.closed) {
                    clearInterval(checkClosed);
                    this.handleShareComplete(platform);
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur ouverture fenêtre partage:', error);
            this.showNotification('Erreur lors du partage. Essayez de copier le lien.', 'error');
            this.copyReferralLink();
        }
    }

    // ===== GESTION DE LA COMPLETION DU PARTAGE =====
    handleShareComplete(platform) {
        // Demander confirmation du partage
        setTimeout(() => {
            if (confirm('Avez-vous bien partagé le quiz ? Cliquez OK pour valider et gagner +1 ticket !')) {
                this.validateShare(platform);
            }
        }, 500);
    }

    // ===== ENREGISTREMENT D'UN PARTAGE =====
    recordShare(platform) {
        this.lastShareTime = Date.now();
        this.dailyShares++;
        this.saveShareData();
        this.updateShareButtons();

        // Log d'activité
        if (window.QuizStorage && window.QuizStorage.logActivity) {
            window.QuizStorage.logActivity('share_initiated', { platform });
        }
    }

    // ===== VALIDATION D'UN PARTAGE =====
    validateShare(platform) {
        try {
            // Ajout des tickets
            if (window.QuizStorage && window.QuizStorage.addTickets) {
                const newTotal = window.QuizStorage.addTickets(SHARE_CONFIG.TICKETS.PER_SHARE, 'share');
                
                this.showNotification(
                    `✅ Partage validé ! +${SHARE_CONFIG.TICKETS.PER_SHARE} ticket (Total: ${newTotal})`,
                    'success'
                );
            }

            // Mise à jour de l'affichage des tickets
            this.updateTicketsDisplay();
            
            // Log de la validation
            if (window.QuizStorage && window.QuizStorage.logActivity) {
                window.QuizStorage.logActivity('share_validated', { platform });
            }

        } catch (error) {
            console.error('❌ Erreur validation partage:', error);
            this.showNotification('Erreur lors de la validation. Réessayez plus tard.', 'error');
        }
    }

    // ===== COPIE DU LIEN DE PARRAINAGE =====
    copyReferralLink() {
        const referralUrl = this.generateShareUrl('referral');
        
        if (navigator.clipboard && window.isSecureContext) {
            // API Clipboard moderne
            navigator.clipboard.writeText(referralUrl).then(() => {
                this.showNotification('✅ Lien copié ! Partagez-le pour gagner des tickets bonus.', 'success');
            }).catch(() => {
                this.fallbackCopyText(referralUrl);
            });
        } else {
            this.fallbackCopyText(referralUrl);
        }
    }

    // ===== COPIE FALLBACK =====
    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showNotification('✅ Lien copié ! Partagez-le pour gagner des tickets bonus.', 'success');
        } catch (error) {
            this.showNotification('Impossible de copier. Sélectionnez et copiez manuellement.', 'warning');
            this.showLinkDialog(text);
        } finally {
            textArea.remove();
        }
    }

    // ===== DIALOGUE D'AFFICHAGE DU LIEN =====
    showLinkDialog(url) {
        const dialog = prompt('Copiez ce lien pour partager :', url);
    }

    // ===== OUVERTURE DE LA MODAL DE PARTAGE =====
    openShareModal() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            // Mise à jour du contenu avant ouverture
            this.updateShareModalContent();
            
            shareModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // ===== MISE À JOUR DU CONTENU DE LA MODAL =====
    updateShareModalContent() {
        // Mise à jour du lien de parrainage
        const referralLinkInput = document.getElementById('referralLinkInput');
        if (referralLinkInput) {
            referralLinkInput.value = this.generateShareUrl('referral');
        }

        // Mise à jour des statistiques de partage
        const shareStats = document.getElementById('shareStats');
        if (shareStats) {
            const userData = window.QuizStorage?.loadUserData() || {};
            shareStats.innerHTML = `
                <div class="share-stat">
                    <span class="share-stat-number">${userData.ticketsFromShares || 0}</span>
                    <span class="share-stat-label">Tickets gagnés</span>
                </div>
                <div class="share-stat">
                    <span class="share-stat-number">${this.dailyShares}</span>
                    <span class="share-stat-label">Partages aujourd'hui</span>
                </div>
            `;
        }

        // Mise à jour des boutons de partage
        this.updateShareButtons();
    }

    // ===== MISE À JOUR DE L'AFFICHAGE DES TICKETS =====
    updateTicketsDisplay() {
        const ticketElements = document.querySelectorAll('[data-tickets]');
        const userData = window.QuizStorage?.loadUserData() || {};
        
        ticketElements.forEach(element => {
            element.textContent = userData.totalTickets || 0;
        });
    }

    // ===== SYSTÈME DE NOTIFICATIONS =====
    showNotification(message, type = 'info') {
        // Création de la notification si elle n'existe pas
        let notification = document.getElementById('shareNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'shareNotification';
            notification.className = 'share-notification';
            document.body.appendChild(notification);
        }

        // Configuration de la notification
        notification.className = `share-notification ${type} active`;
        notification.textContent = message;

        // Auto-suppression
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    }

    // ===== MÉTHODES PUBLIQUES =====

    /**
     * Obtient les statistiques de partage de l'utilisateur
     * @returns {Object} Statistiques de partage
     */
    getShareStats() {
        const userData = window.QuizStorage?.loadUserData() || {};
        return {
            dailyShares: this.dailyShares,
            maxDailyShares: SHARE_CONFIG.TICKETS.MAX_DAILY_SHARES,
            totalTicketsFromShares: userData.ticketsFromShares || 0,
            referralCode: this.userReferralCode,
            canShare: this.canUserShare().allowed
        };
    }

    /**
     * Force la réinitialisation des données de partage
     */
    resetShareData() {
        this.dailyShares = 0;
        this.lastShareTime = null;
        this.saveShareData();
        this.updateShareButtons();
        console.log('🔄 Données de partage réinitialisées');
    }
}

// ===== INITIALISATION GLOBALE =====
window.ShareManager = ShareManager;

// Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les autres systèmes soient chargés
    if (typeof window.QuizStorage !== 'undefined') {
        window.quizShare = new ShareManager();
        console.log('✅ Système de partage activé');
    } else {
        // Réessayer après un court délai
        setTimeout(() => {
            window.quizShare = new ShareManager();
            console.log('✅ Système de partage activé (délai)');
        }, 1000);
    }
});

// ===== FONCTIONS UTILITAIRES GLOBALES =====

/**
 * Fonction helper pour déclencher un partage depuis n'importe où
 * @param {string} platform - Plateforme de partage
 */
window.shareToSocial = function(platform) {
    if (window.quizShare) {
        window.quizShare.shareToSocial(platform);
    } else {
        console.warn('⚠️ Système de partage non initialisé');
    }
};

/**
 * Fonction helper pour copier le lien de parrainage
 */
window.copyReferralLink = function() {
    if (window.quizShare) {
        window.quizShare.copyReferralLink();
    } else {
        console.warn('⚠️ Système de partage non initialisé');
    }
};

console.log('📤 Module de partage social chargé - Quiz CODM');