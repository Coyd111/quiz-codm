/**
 * ===== QUIZ CODM - SYSTÈME DE PARTAGE =====
 * Partage des scores sur réseaux sociaux et par liens
 * Auteur: Coyd WILLZ
 */

// ===== CONFIGURATION DU PARTAGE =====
const SHARE_CONFIG = {
    siteName: 'Quiz CODM',
    siteUrl: window.location.origin + '/quiz-codm/',
    hashtags: ['CODM', 'CallOfDutyMobile', 'Quiz', 'Gaming'],
    defaultMessage: 'Je viens de faire le Quiz Call of Duty Mobile !',
    shareImage: null, // URL d'image pour partage (sera générée)
    enabledPlatforms: ['twitter', 'facebook', 'whatsapp', 'telegram', 'copy', 'native']
};

// ===== TEMPLATES DE MESSAGES =====
const SHARE_TEMPLATES = {
    excellent: {
        emoji: '🔥',
        text: 'PARFAIT ! J\'ai obtenu {score}/10 au Quiz CODM ! 🏆 Je maîtrise l\'univers Call of Duty Mobile ! Tu penses pouvoir faire mieux ?'
    },
    very_good: {
        emoji: '🎯',
        text: 'Excellent ! {score}/10 au Quiz CODM ! 💪 Je connais bien l\'univers Call of Duty Mobile ! À ton tour de jouer !'
    },
    good: {
        emoji: '👍',
        text: 'Pas mal ! {score}/10 au Quiz CODM ! ⭐ J\'ai de bonnes connaissances sur Call of Duty Mobile ! Teste tes connaissances toi aussi !'
    },
    average: {
        emoji: '😊',
        text: 'Résultat correct ! {score}/10 au Quiz CODM ! 🎮 Il me reste encore des choses à apprendre sur Call of Duty Mobile !'
    },
    below_average: {
        emoji: '🤔',
        text: 'Challenge relevé ! {score}/10 au Quiz CODM ! 📚 Time to improve ! Essaie à ton tour !'
    },
    low: {
        emoji: '💪',
        text: 'Premier essai ! {score}/10 au Quiz CODM ! 🎯 Mais je ne lâche rien ! À toi de jouer maintenant !'
    }
};

// ===== URLS DES PLATEFORMES =====
const PLATFORM_URLS = {
    twitter: 'https://twitter.com/intent/tweet',
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    whatsapp: 'https://wa.me/',
    telegram: 'https://t.me/share/url',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
    reddit: 'https://reddit.com/submit'
};

// ===== FONCTIONS UTILITAIRES =====

/**
 * Génère un message personnalisé selon le score
 * @param {number} score - Score obtenu
 * @param {number} total - Total possible
 * @param {number} timeElapsed - Temps écoulé
 * @returns {Object} Message formaté avec emoji
 */
function generateScoreMessage(score, total = 10, timeElapsed = 0) {
    const percentage = Math.round((score / total) * 100);
    const timeText = timeElapsed > 0 ? ` en ${formatTime(timeElapsed)}` : '';
    
    let template;
    if (percentage === 100) {
        template = SHARE_TEMPLATES.excellent;
    } else if (percentage >= 90) {
        template = SHARE_TEMPLATES.very_good;
    } else if (percentage >= 70) {
        template = SHARE_TEMPLATES.good;
    } else if (percentage >= 50) {
        template = SHARE_TEMPLATES.average;
    } else if (percentage >= 30) {
        template = SHARE_TEMPLATES.below_average;
    } else {
        template = SHARE_TEMPLATES.low;
    }
    
    const message = template.text
        .replace('{score}', score)
        .replace('{total}', total)
        .replace('{percentage}', percentage)
        .replace('{time}', timeText);
    
    return {
        emoji: template.emoji,
        text: message,
        percentage: percentage
    };
}

/**
 * Formate le temps pour affichage
 * @param {number} milliseconds - Temps en millisecondes
 * @returns {string} Temps formaté
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

/**
 * Génère l'URL de partage pour une plateforme
 * @param {string} platform - Plateforme cible
 * @param {Object} data - Données à partager
 * @returns {string} URL de partage
 */
function generateShareUrl(platform, data) {
    const { text, url, hashtags } = data;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = hashtags ? encodeURIComponent(hashtags.join(',')) : '';
    
    switch (platform) {
        case 'twitter':
            return `${PLATFORM_URLS.twitter}?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`;
            
        case 'facebook':
            return `${PLATFORM_URLS.facebook}?u=${encodedUrl}&quote=${encodedText}`;
            
        case 'whatsapp':
            return `${PLATFORM_URLS.whatsapp}?text=${encodedText}%20${encodedUrl}`;
            
        case 'telegram':
            return `${PLATFORM_URLS.telegram}?url=${encodedUrl}&text=${encodedText}`;
            
        case 'linkedin':
            return `${PLATFORM_URLS.linkedin}?url=${encodedUrl}&title=${encodeURIComponent(SHARE_CONFIG.siteName)}&summary=${encodedText}`;
            
        case 'reddit':
            return `${PLATFORM_URLS.reddit}?url=${encodedUrl}&title=${encodedText}`;
            
        default:
            return url;
    }
}

// ===== FONCTIONS DE PARTAGE =====

/**
 * Partage un score sur une plateforme spécifique
 * @param {string} platform - Plateforme de partage
 * @param {Object} scoreData - Données du score
 * @returns {Promise<boolean>} Succès du partage
 */
async function shareScore(platform, scoreData) {
    try {
        const { score, total, timeElapsed, playerName } = scoreData;
        const message = generateScoreMessage(score, total, timeElapsed);
        
        // Générer le texte de partage
        const shareText = `${message.emoji} ${message.text}`;
        const shareUrl = SHARE_CONFIG.siteUrl;
        const hashtags = SHARE_CONFIG.hashtags;
        
        const shareData = {
            text: shareText,
            url: shareUrl,
            hashtags: hashtags
        };
        
        // Gérer le partage selon la plateforme
        switch (platform) {
            case 'native':
                return await shareNative(shareData);
                
            case 'copy':
                return await copyToClipboard(`${shareText}\n${shareUrl}`);
                
            default:
                return shareOnPlatform(platform, shareData);
        }
    } catch (error) {
        console.error(`❌ Erreur partage ${platform}:`, error);
        return false;
    }
}

/**
 * Partage natif (Web Share API)
 * @param {Object} shareData - Données à partager
 * @returns {Promise<boolean>} Succès du partage
 */
async function shareNative(shareData) {
    if (!navigator.share) {
        console.warn('⚠️ Web Share API non supportée');
        return false;
    }
    
    try {
        await navigator.share({
            title: SHARE_CONFIG.siteName,
            text: shareData.text,
            url: shareData.url
        });
        
        console.log('✅ Partage natif réussi');
        return true;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('❌ Erreur partage natif:', error);
        }
        return false;
    }
}

/**
 * Partage sur une plateforme externe
 * @param {string} platform - Plateforme cible
 * @param {Object} shareData - Données à partager
 * @returns {boolean} Succès de l'ouverture
 */
function shareOnPlatform(platform, shareData) {
    try {
        const shareUrl = generateShareUrl(platform, shareData);
        
        // Ouvrir dans un nouvel onglet/fenêtre
        const popup = window.open(
            shareUrl,
            'share',
            'width=600,height=400,scrollbars=yes,resizable=yes'
        );
        
        if (popup) {
            console.log(`✅ Partage ${platform} ouvert`);
            return true;
        } else {
            console.warn(`⚠️ Popup bloqué pour ${platform}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Erreur partage ${platform}:`, error);
        return false;
    }
}

/**
 * Copie le texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} Succès de la copie
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            console.log('✅ Texte copié dans le presse-papiers');
            return true;
        } else {
            // Fallback pour navigateurs plus anciens
            return copyToClipboardFallback(text);
        }
    } catch (error) {
        console.error('❌ Erreur copie presse-papiers:', error);
        return copyToClipboardFallback(text);
    }
}

/**
 * Méthode de fallback pour copier dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {boolean} Succès de la copie
 */
function copyToClipboardFallback(text) {
    try {
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
        
        if (successful) {
            console.log('✅ Texte copié (fallback)');
        }
        return successful;
    } catch (error) {
        console.error('❌ Erreur copie fallback:', error);
        return false;
    }
}

// ===== INTERFACE UTILISATEUR =====

/**
 * Ouvre le modal de partage
 * @param {Object} scoreData - Données du score à partager
 */
function openShareModal(scoreData) {
    // Supprimer le modal existant s'il y en a un
    closeShareModal();
    
    const modal = createShareModal(scoreData);
    document.body.appendChild(modal);
    
    // Animer l'ouverture
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Gérer la fermeture avec Escape
    document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Ferme le modal de partage
 */
function closeShareModal() {
    const existingModal = document.getElementById('share-modal');
    if (existingModal) {
        existingModal.classList.remove('active');
        setTimeout(() => {
            existingModal.remove();
            document.removeEventListener('keydown', handleEscapeKey);
        }, 300);
    }
}

/**
 * Créé le modal de partage
 * @param {Object} scoreData - Données du score
 * @returns {Element} Élément modal
 */
function createShareModal(scoreData) {
    const score = typeof scoreData.score === 'number' ? scoreData.score : 0;
    const questionsCount = typeof scoreData.questionsCount === 'number' ? scoreData.questionsCount : 10;
    const timeElapsed = typeof scoreData.timeElapsed === 'number' ? scoreData.timeElapsed : 0;
    const playerName = scoreData.playerName || 'Invité';
    const message = generateScoreMessage(score, questionsCount, timeElapsed);

    // Générer le lien de défi
    const challengeLink = generateChallengeLink(scoreData);

    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'share-modal';

    modal.innerHTML = `
        <div class="share-modal-backdrop" onclick="closeShareModal()"></div>
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h2>🎉 Partager mon score</h2>
                <button class="share-modal-close" onclick="closeShareModal()">×</button>
            </div>
            
            <div class="share-score-preview">
                <div class="score-display">
                    <span class="score-emoji">${message.emoji}</span>
                    <span class="score-text">${score}/${questionsCount}</span>
                    <span class="score-percentage">${message.percentage}%</span>
                </div>
                <p class="score-message">${message.text}</p>
                ${timeElapsed > 0 ? `<p class="score-time">⏱️ Temps: ${formatTime(timeElapsed)}</p>` : ''}
            </div>
            
            <div class="share-platforms">
                <h3>Choisir une plateforme</h3>
                <div class="platform-buttons">
                    ${generatePlatformButtons(scoreData).join('')}
                </div>
            </div>
            
            <div class="share-link-section" style="margin:1rem 0;text-align:center;">
                <input type="text" id="challenge-link-input" value="${challengeLink}" readonly style="width:70%;padding:0.5rem;border-radius:5px;border:1px solid #ccc;">
                <button class="btn btn-primary" onclick="copyChallengeLink()" style="margin-left:0.5rem;">Copier le lien</button>
            </div>
            
            <div class="share-actions">
                <button class="btn btn-secondary" onclick="closeShareModal()">
                    Fermer
                </button>
            </div>
        </div>
    `;

    return modal;
}

function copyChallengeLink() {
    const input = document.getElementById('challenge-link-input');
    input.select();
    input.setSelectionRange(0, 99999); // Pour mobile
    document.execCommand('copy');
    showShareFeedback('copy', true);
}
window.copyChallengeLink = copyChallengeLink;

/**
 * Génère les boutons de plateformes
 * @param {Object} scoreData - Données du score
 * @returns {Array} HTML des boutons
 */
function generatePlatformButtons(scoreData) {
    const platforms = [
        { 
            id: 'native', 
            name: 'Partager', 
            icon: '<i class="fas fa-share-alt"></i>', 
            color: '#007bff',
            condition: () => navigator.share 
        },
        { 
            id: 'twitter', 
            name: 'Twitter', 
            icon: '<i class="fab fa-twitter"></i>', 
            color: '#1da1f2' 
        },
        { 
            id: 'facebook', 
            name: 'Facebook', 
            icon: '<i class="fab fa-facebook-f"></i>', 
            color: '#1877f3' 
        },
        { 
            id: 'whatsapp', 
            name: 'WhatsApp', 
            icon: '<i class="fab fa-whatsapp"></i>', 
            color: '#25d366' 
        },
        { 
            id: 'telegram', 
            name: 'Telegram', 
            icon: '<i class="fab fa-telegram-plane"></i>', 
            color: '#229ed9' 
        },
        { 
            id: 'copy', 
            name: 'Copier', 
            icon: '<i class="fas fa-copy"></i>', 
            color: '#ffc107' 
        }
    ];
    
    return platforms
        .filter(platform => !platform.condition || platform.condition())
        .map(platform => `
            <button 
                class="platform-btn" 
                style="--platform-color: ${platform.color}"
                onclick="handlePlatformShare('${platform.id}', ${JSON.stringify(scoreData).replace(/"/g, '&quot;')})"
                title="Partager sur ${platform.name}"
            >
                <span class="platform-icon">${platform.icon}</span>
                <span class="platform-name">${platform.name}</span>
            </button>
        `);
}

/**
 * Gère le clic sur un bouton de plateforme
 * @param {string} platform - ID de la plateforme
 * @param {Object} scoreData - Données du score
 */
async function handlePlatformShare(platform, scoreData) {
    try {
        const success = await shareScore(platform, scoreData);
        
        if (success) {
            showShareFeedback(platform, true);
            
            // Fermer le modal après un court délai pour la copie
            if (platform === 'copy') {
                setTimeout(closeShareModal, 1500);
            }
        } else {
            showShareFeedback(platform, false);
        }
    } catch (error) {
        console.error('❌ Erreur partage:', error);
        showShareFeedback(platform, false);
    }
}

/**
 * Affiche un feedback de partage
 * @param {string} platform - Plateforme utilisée
 * @param {boolean} success - Succès du partage
 */
function showShareFeedback(platform, success) {
    const message = success ? 
        (platform === 'copy' ? '📋 Copié dans le presse-papiers !' : '✅ Partagé avec succès !') :
        '❌ Erreur lors du partage';
    
    // Créer le toast de feedback
    const toast = document.createElement('div');
    toast.className = `share-toast ${success ? 'success' : 'error'}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animer et supprimer
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

/**
 * Gère la touche Escape pour fermer le modal
 * @param {Event} event - Événement clavier
 */
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeShareModal();
    }
}

// ===== PARTAGE RAPIDE =====

/**
 * Partage rapide avec le meilleur score
 * @param {string} platform - Plateforme de partage
 */
function quickShare(platform = 'native') {
    const bestScore = QuizStorage.getPersonalBest();
    
    if (!bestScore) {
        alert('Aucun score à partager ! Joue d\'abord au quiz.');
        return;
    }
    
    shareScore(platform, bestScore);
}

/**
 * Génère un lien de défi
 * @param {Object} scoreData - Score à battre
 * @returns {string} URL de défi
 */
function generateChallengeLink(scoreData) {
    const challengeData = {
        score: scoreData.score,
        time: scoreData.timeElapsed,
        player: scoreData.playerName
    };
    
    const encodedData = btoa(JSON.stringify(challengeData));
    return `${SHARE_CONFIG.siteUrl}?challenge=${encodedData}`;
}

// ===== EXPOSITION GLOBALE =====

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shareScore,
        openShareModal,
        closeShareModal,
        quickShare,
        generateScoreMessage,
        copyToClipboard,
        generateChallengeLink
    };
}

// Rendre disponible globalement
window.QuizShare = {
    shareScore,
    openShareModal,
    closeShareModal,
    quickShare,
    generateScoreMessage,
    copyToClipboard,
    generateChallengeLink
};
console.log('✅ QuizShare exposé sur window', window.QuizShare);

// Rendre les fonctions disponibles globalement pour les onclick
window.closeShareModal = closeShareModal;
window.handlePlatformShare = handlePlatformShare;

// ===== STYLES CSS POUR LE MODAL =====

// Ajouter les styles CSS du modal
const shareStyles = `
<style id="share-modal-styles">
.share-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.share-modal.active {
    opacity: 1;
    visibility: visible;
}

.share-modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.share-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: #1a1a1a;
    border: 2px solid #FFD700;
    border-radius: 15px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    transition: transform 0.3s ease;
}

.share-modal.active .share-modal-content {
    transform: translate(-50%, -50%) scale(1);
}

.share-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
}

.share-modal-header h2 {
    color: #FFD700;
    margin: 0;
    font-size: 1.5rem;
}

.share-modal-close {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
}

.share-modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.share-score-preview {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(255, 215, 0, 0.3);
}

.score-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: bold;
}

.score-emoji {
    font-size: 2.5rem;
}

.score-text {
    color: #FFD700;
}

.score-percentage {
    color: #fff;
    font-size: 1.5rem;
}

.score-message {
    color: #fff;
    margin: 0.5rem 0;
    font-size: 1rem;
    line-height: 1.4;
}

.score-time {
    color: #ccc;
    margin: 0;
    font-size: 0.9rem;
}

.share-platforms h3 {
    color: #FFD700;
    margin-bottom: 1rem;
    text-align: center;
}

.platform-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.platform-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--platform-color, #333);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

.platform-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.platform-icon {
    font-size: 1.5rem;
}

.platform-name {
    font-size: 0.9rem;
    font-weight: 500;
}

.share-actions {
    text-align: center;
    border-top: 1px solid #333;
    padding-top: 1rem;
}

.share-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.share-toast.success {
    background: #28a745;
}

.share-toast.error {
    background: #dc3545;
}

.share-toast.show {
    transform: translateX(0);
}

@media (max-width: 600px) {
    .share-modal-content {
        width: 95%;
        padding: 1.5rem;
    }
    
    .platform-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .score-display {
        font-size: 1.5rem;
    }
    
    .score-emoji {
        font-size: 2rem;
    }
}
</style>
`;

// Injecter les styles
if (!document.getElementById('share-modal-styles')) {
    document.head.insertAdjacentHTML('beforeend', shareStyles);
}

console.log('📤 Quiz CODM - Système de partage chargé');
