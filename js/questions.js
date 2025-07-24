// === QUIZ APP PRINCIPALE ===

// Variables et éléments globaux
let userData = {};
let userTickets = 0;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;
let quizStartTime = null;
let hasPlayedToday = false;
let quizEndTime = null;

// Initial elements - will be populated in initializeElements()
let elements = {};

// Initialize DOM elements
function initializeElements() {
    console.log('Initialisation des éléments du DOM...');
    
    // Créer un nouvel objet elements
    const elements = {
        startQuizBtn: document.getElementById('startQuizBtn'),
        quizStart: document.getElementById('quizStart'),
        quizGame: document.getElementById('quizGame'),
        participationModal: document.getElementById('participationModal'),
        questionsCount: document.getElementById('questionsCount'),
        burgerMenu: document.getElementById('burgerMenu'),
        mobileOverlay: document.getElementById('mobileOverlay'),
        mobileNav: document.getElementById('mobileNav'),
        shareScoreBtn: document.getElementById('shareScoreBtn'),
        shareBtn: document.getElementById('shareBtn'),
        questionText: document.getElementById('questionText'),
        answersContainer: document.getElementById('answersContainer'),
        currentQuestion: document.getElementById('currentQuestion'),
        progressFill: document.getElementById('progressFill'),
        finalScore: document.getElementById('finalScore'),
        resultsTitle: document.getElementById('resultsTitle'),
        resultsMessage: document.getElementById('resultsMessage'),
        participationForm: document.getElementById('participationForm'),
        closeModal: document.querySelector('.modal-close'),
        closeShareModal: document.getElementById('closeShareModal'),
        shareModal: document.getElementById('shareModal')
    };
    
    // Log des éléments trouvés
    console.log('Éléments initialisés:', {
        startQuizBtn: !!elements.startQuizBtn,
        quizStart: !!elements.quizStart,
        quizGame: !!elements.quizGame,
        participationForm: !!elements.participationForm
    });
    
    console.log('Éléments trouvés:', Object.keys(elements).filter(k => elements[k] !== null).length + '/' + Object.keys(elements).length);
    
    // Retourner l'objet elements
    return elements;
}

// === DÉMARRAGE DU QUIZ ===
// La fonction startQuiz est définie plus bas dans le fichier

// === AFFICHAGE DES QUESTIONS ===
function displayQuestion() {
    // À compléter selon ton HTML (affichage dynamique de la question courante)
}

// === SOUMISSION DE RÉPONSE ===
function submitAnswer(answer) {
    userAnswers.push(answer);
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// === FIN DU QUIZ ===
function endQuiz() {
    quizScore = userAnswers.reduce((score, ans, idx) => {
        return score + (ans === currentQuestions[idx].correctAnswer ? 1 : 0);
    }, 0);
    elements.quizGame?.classList.add('hidden');
    openParticipationModal();
    if (window.QuizStorage && window.QuizStorage.storage) {
        window.QuizStorage.storage.logActivity('quiz_completed', {
            score: quizScore,
            answers: userAnswers
        });
    }
}

// === MODALS PARTICIPATION ===
function openParticipationModal() {
    elements.participationModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
function closeParticipationModal() {
    elements.participationModal?.classList.add('hidden');
    document.body.style.overflow = '';
}

// === ENREGISTREMENT DE LA PARTICIPATION ===
function saveParticipation(participationData) {
    try {
        const ticketsAvant = userTickets;
        const success = window.QuizStorage.participate(participationData);
        const ticketsApres = window.QuizStorage.getTickets();
        userTickets = ticketsApres;
        userData = window.QuizStorage.getUserData();
        hasPlayedToday = (userData.lastPlayDate === (new Date()).toISOString().slice(0, 10));
        updateUserInterface();
        if (success && ticketsApres > ticketsAvant) {
            showParticipationSuccess();
            if (window.QuizStorage && window.QuizStorage.storage) {
                window.QuizStorage.storage.logActivity('participation_completed', {
                    username: participationData.username,
                    ticketsAvant,
                    ticketsApres
                });
            }
            console.log('✅ Participation enregistrée');
        } else {
            showErrorNotification('Erreur lors de l\'enregistrement de votre participation. Veuillez réessayer.');
            console.error('❌ Erreur lors de la participation');
        }
    } catch (e) {
        alert("Erreur lors de l'enregistrement de votre participation. Veuillez réessayer.");
        console.error("Erreur QuizStorage.saveParticipation:", e);
    }
}

// === SUCCÈS PARTICIPATION ===
function showParticipationSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-notification visible animate-confetti';
    successMessage.setAttribute('role', 'alert');
    successMessage.setAttribute('aria-live', 'assertive');
    successMessage.setAttribute('tabindex', '-1');
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.zIndex = '9999';
    successMessage.style.background = 'rgba(30,35,60,0.98)';
    successMessage.style.color = '#fff';
    successMessage.style.padding = '2.5rem 2.5rem 2rem 2.5rem';
    successMessage.style.borderRadius = '1.2em';
    successMessage.style.boxShadow = '0 8px 32px #000b, 0 0 32px #50fa7b55';
    successMessage.innerHTML = `
        <button class=\"close-success\" aria-label=\"Fermer la notification\" style=\"position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#fff;cursor:pointer;\">&times;</button>
        <div style=\"display:flex;flex-direction:column;align-items:center;\">
            <span style=\"font-size:2.5rem;line-height:1;display:block;margin-bottom:.5rem;\"><i class=\"fas fa-trophy\" aria-hidden=\"true\" style=\"color:#ffe066;text-shadow:0 0 8px #50fa7b;\"></i></span>
            <h3 style=\"margin:1rem 0 .5rem 0;font-size:1.6rem;\">Participation enregistrée !</h3>
            <p style=\"margin-bottom:.7rem;font-size:1.15rem;\">Score du jour : <strong class=\"score-glow\" style=\"color:#fff;font-size:1.4em;text-shadow:0 0 8px #50fa7b,0 0 16px #ffe066;\">${userData?.todayScore ?? 0}/10</strong></p>
            <p style=\"margin-bottom:.7rem;font-size:1.15rem;\">Tickets cumulés : <strong class=\"tickets-glow\" style=\"color:#fff;font-size:1.4em;text-shadow:0 0 8px #ffe066,0 0 16px #50fa7b;\">${userTickets}</strong></p>
            <button class=\"share-score-btn\" style=\"margin-top:1rem;padding:.6em 1.2em;font-size:1.1rem;font-weight:700;border-radius:.8em;background:linear-gradient(90deg,#50fa7b,#ffe066);color:#222;box-shadow:0 2px 8px #ffe06699;cursor:pointer;border:none;outline:none;transition:background 0.2s;\">
                <i class=\"fas fa-share\" style=\"margin-right:.5em;\"></i>Partager mon score
            </button>
            <p style=\"margin-top:1.2rem;font-size:.98rem;opacity:.8;\">Partage ton score pour gagner plus de tickets !</p>
        </div>
    `;
    document.body.appendChild(successMessage);
    successMessage.focus();
    const closeBtn = successMessage.querySelector('.close-success');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => successMessage.remove());
    }
    function handleEscClose(e) {
        if (e.key === 'Escape') {
            successMessage.remove();
            document.removeEventListener('keydown', handleEscClose);
        }
    }
    document.addEventListener('keydown', handleEscClose);
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    const shareBtn = successMessage.querySelector('.share-score-btn');
    if (shareBtn && typeof openShareModal === 'function') {
        shareBtn.addEventListener('click', openShareModal);
    }
    setTimeout(() => {
        if (document.body.contains(successMessage)) successMessage.remove();
    }, 6000);
}

// === STATISTIQUES ===
function updateStats() {
    if (elements.questionsCount && typeof window.questions !== 'undefined') {
        elements.questionsCount.textContent = window.questions.length;
    }
    if (window.QuizStorage) {
        const analytics = window.QuizStorage.analytics();
        console.log('📊 Analytics:', analytics);
    }
}

// === MENU MOBILE ===
function setupMobileMenu() {
    const burgerBtn = elements.burgerMenu;
    const overlay = elements.mobileOverlay;
    const mobileNav = elements.mobileNav;
    if (!burgerBtn || !overlay || !mobileNav) {
        console.warn('⚠️ Éléments du menu mobile introuvables');
        return;
    }
    burgerBtn.addEventListener('click', function() {
        const isActive = burgerBtn.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    overlay.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}
function openMobileMenu() {
    elements.burgerMenu?.classList.add('active');
    elements.mobileOverlay?.classList.add('active');
    elements.mobileNav?.classList.add('active');
    document.body.classList.add('menu-open');
}
function closeMobileMenu() {
    elements.burgerMenu?.classList.remove('active');
    elements.mobileOverlay?.classList.remove('active');
    elements.mobileNav?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// === UTILITAIRES ===
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function showStorageWarning() {
    const warning = document.createElement('div');
    warning.className = 'storage-warning';
    warning.innerHTML = `
        <div class=\"warning-content\">
            <i class=\"fas fa-exclamation-triangle\"></i>
            <h3>Mode dégradé</h3>
            <p>Le stockage local n'est pas disponible. Certaines fonctionnalités peuvent être limitées.</p>
        </div>
    `;
    document.body.appendChild(warning);
    setTimeout(() => {
        warning.remove();
    }, 5000);
}

// === EXPORT POUR DEBUG ===
window.QuizApp = {
    userData,
    currentQuestions,
    elements,
    getStats: () => window.QuizStorage?.analytics(),
    getTickets: () => userTickets,
    resetDaily: () => {
        hasPlayedToday = false;
        checkDailyQuizStatus();
    },
    completeQuiz: () => {
        quizScore = 8;
        endQuiz();
    }
};

// Gestionnaire d'événement DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 [DEBUG] Début de l\'initialisation DOMContentLoaded');
    console.log('🎮 [DEBUG] window.QuizStorage:', typeof window.QuizStorage);
    console.log('🎮 [DEBUG] window.questions:', window.questions ? `Tableau de ${window.questions.length} questions` : 'non défini');
    
    try {
        // 1. Initialisation des éléments DOM
        console.log('1. Initialisation des éléments du DOM...');
        console.log('[DEBUG] Avant initializeElements()');
        elements = initializeElements();
        console.log('[DEBUG] Après initializeElements(), éléments trouvés:', Object.keys(elements).filter(k => elements[k] !== null).join(', '));
        
        // Vérification des éléments critiques
        if (!elements.startQuizBtn || !elements.quizStart || !elements.quizGame) {
            const missingElements = [];
            if (!elements.startQuizBtn) missingElements.push('startQuizBtn');
            if (!elements.quizStart) missingElements.push('quizStart');
            if (!elements.quizGame) missingElements.push('quizGame');
            
            console.error('❌ Éléments critiques manquants dans le DOM:', missingElements.join(', '));
            alert('Erreur d\'initialisation: éléments manquants dans la page. Veuillez recharger la page.');
            return;
        }
        
        // 2. Initialisation de l'application
        console.log('2. Initialisation de l\'application...');
        console.log('[DEBUG] Avant initializeApp()');
        initializeApp();
        console.log('[DEBUG] Après initializeApp()');
        
        // 3. Vérification de l'état du quiz (AVANT la configuration des écouteurs)
        console.log('3. Vérification de l\'état du quiz...');
        console.log('[DEBUG] Avant checkDailyQuizStatus()');
        try {
            checkDailyQuizStatus();
            console.log('[DEBUG] Après checkDailyQuizStatus(), hasPlayedToday:', hasPlayedToday);
        } catch (error) {
            console.error('❌ Erreur lors de la vérification de l\'état du quiz:', error);
            // On continue malgré l'erreur, ce n'est pas bloquant
        }
        
        // 4. Configuration des écouteurs d'événements
        console.log('4. Configuration des écouteurs d\'événements...');
        console.log('[DEBUG] Avant setupEventListeners()');
        setupEventListeners();
        console.log('[DEBUG] Après setupEventListeners()');
        setupMobileMenu();
        console.log('[DEBUG] Après setupMobileMenu()');
        
        // 5. Mise à jour de l'interface utilisateur
        console.log('5. Mise à jour de l\'interface utilisateur...');
        updateStats();
        updateUserInterface();
        
        // Afficher l'état approprié en fonction de hasPlayedToday
        if (hasPlayedToday) {
            showCompletedState();
        } else {
            showStartState();
        }
        
        // 6. Vérification du stockage local
        console.log('6. Vérification du stockage local...');
        if (window.QuizStorage && !window.QuizStorage.isSupported()) {
            console.warn('⚠️ Le stockage local n\'est pas supporté ou est désactivé');
            showStorageWarning();
        }
        
        console.log('✅ Initialisation terminée avec succès');
        
    } catch (error) {
        console.error('❌ ERREUR CRITIQUE lors de l\'initialisation:', error);
        alert('Une erreur critique est survenue lors du chargement de l\'application. Veuillez recharger la page.');
        
        // Tentative de récupération
        try {
            if (elements.quizStart) {
                elements.quizStart.classList.remove('hidden');
            }
            if (elements.quizGame) {
                elements.quizGame.classList.add('hidden');
            }
        } catch (e) {
            console.error('Impossible de récupérer l\'interface utilisateur:', e);
        }
    }
    
    // Vérification des modules optionnels
    if (typeof window.quizShare === 'undefined') {
        console.warn('⚠️ Module de partage (quizShare) non initialisé. Le quiz reste accessible.');
    }
    if (typeof window.quizReferral === 'undefined') {
        console.warn('⚠️ Module de parrainage (quizReferral) non initialisé. Le quiz reste accessible.');
    }
});

// ===== FONCTIONS D'INITIALISATION =====
function initializeApp() {
    // Vérification du support du stockage
    if (!window.QuizStorage.isSupported()) {
        console.warn('⚠️ Stockage local non supporté - Mode dégradé');
        showStorageWarning();
    }
    
    // Chargement des données utilisateur via le nouveau système
    userData = window.QuizStorage.loadUser();
    userTickets = userData.totalTickets;
    
    // Mise à jour de l'affichage
    updateUserInterface();
    
    // Mélange des questions du jour
    if (typeof window.questions !== 'undefined') {
        // Utilisation du système de questions équilibrées
        if (typeof getBalancedQuestions === 'function') {
            currentQuestions = getBalancedQuestions(10);
        } else {
            currentQuestions = getRandomQuestions(window.questions, 10);
        }
    } else {
        console.warn('⚠️ Questions non chargées, utilisation des questions par défaut');
        currentQuestions = getDefaultQuestions();
    }
    
    console.log('✅ Application initialisée avec système de stockage avancé');
}

// ===== INTERFACE UTILISATEUR =====
function updateUserInterface() {
    // Mise à jour des tickets affichés
    if (elements.totalTickets) {
        elements.totalTickets.textContent = userTickets;
    }
    // Mise à jour du header (tickets + score)
    const headerTickets = document.getElementById('totalTicketsHeader');
    if (headerTickets) {
        headerTickets.textContent = userTickets;
    }
    const headerScore = document.getElementById('todayScoreHeader');
    if (headerScore && userData && typeof userData.todayScore !== 'undefined') {
        headerScore.textContent = `${userData.todayScore}/10`;
    }
    // Mise à jour des statistiques si disponibles
    const analytics = window.QuizStorage.analytics();
    if (elements.totalPlayers && analytics.totalQuizzes > 0) {
        // Simulation du nombre total de joueurs basé sur les analytics locales
        const estimatedPlayers = Math.max(1247, analytics.totalQuizzes * 10);
        elements.totalPlayers.textContent = estimatedPlayers.toLocaleString();
    }
}

// ===== GESTION DU QUIZ QUOTIDIEN =====
function checkDailyQuizStatus() {
    console.log('📅 [DEBUG] Vérification du statut quotidien du quiz...');
    console.log('[DEBUG] Avant vérification, hasPlayedToday:', hasPlayedToday);
    
    try {
        // Vérification de la disponibilité de QuizStorage
        if (!window.QuizStorage) {
            console.warn('QuizStorage n\'est pas disponible - Vérification du statut du quiz impossible');
            hasPlayedToday = false;
            showStartState();
            return;
        }
        
        // Chargement des données utilisateur avec gestion d'erreur
        console.log('[DEBUG] Chargement des données utilisateur...');
        try {
            userData = window.QuizStorage.loadUser();
            console.log('[DEBUG] Données utilisateur chargées:', {
                lastPlayDate: userData?.lastPlayDate || 'non défini',
                lastPlayTime: userData?.lastPlayTime || 'non défini',
                playCount: userData?.playCount || 0
            });
        } catch (e) {
            console.error('❌ Erreur lors du chargement des données utilisateur:', e);
            userData = { lastPlayDate: null };
            console.log('[DEBUG] Valeur par défaut pour userData:', userData);
        }
        
        const today = new Date().toDateString();
        const now = new Date();
        const lastPlayDate = userData?.lastPlayDate || null;
        
        console.log('[DEBUG] Dates importantes:', {
            'Date du jour (toDateString)': today,
            'Date complète': now.toISOString(),
            'Dernière date de jeu': lastPlayDate || 'jamais',
            'Heure actuelle locale': now.toLocaleTimeString(),
            'Fuseau horaire': Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        // Vérification si l'utilisateur a déjà joué aujourd'hui
        if (lastPlayDate && typeof lastPlayDate === 'string') {
            const lastPlayDateObj = new Date(lastPlayDate);
            const todayObj = new Date(today);
            
            console.log('[DEBUG] Comparaison des dates:', {
                'lastPlayDate (reconstruite)': lastPlayDateObj.toISOString(),
                'today (reconstruite)': todayObj.toISOString(),
                'Dates identiques?': lastPlayDate === today
            });
            
            hasPlayedToday = (lastPlayDate === today);
            console.log('ℹ️ L\'utilisateur a déjà joué aujourd\'hui:', hasPlayedToday);
            
            // Si l'utilisateur a déjà joué, on récupère l'heure du dernier jeu
            if (hasPlayedToday && userData.lastPlayTime) {
                const lastPlayTime = new Date(userData.lastPlayTime);
                const timeOptions = { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                };
                const formattedTime = lastPlayTime.toLocaleTimeString('fr-FR', timeOptions);
                
                // Mise à jour du message avec l'heure du dernier jeu
                const completedMessage = document.querySelector('.quiz-completed-message');
                if (completedMessage) {
                    completedMessage.textContent = `Vous avez déjà joué aujourd'hui à ${formattedTime}. Revenez demain pour un nouveau quiz !`;
                    console.log('Message de quiz terminé mis à jour avec l\'heure:', formattedTime);
                }
            }
        } else {
            hasPlayedToday = false;
            console.log('Aucune date de jeu précédente trouvée - Considéré comme nouveau joueur');
        }
        
        // Mise à jour de l'interface utilisateur
        if (hasPlayedToday) {
            console.log('Affichage de l\'état "quiz terminé"');
            showCompletedState();
        } else {
            console.log('Affichage de l\'état de démarrage');
            showStartState();
        }
        
    } catch (error) {
        console.error('Erreur critique lors de la vérification du statut du quiz:', error);
        // En cas d'erreur, on considère que l'utilisateur n'a pas joué aujourd'hui
        hasPlayedToday = false;
        showStartState();
    }
}

function showStartState() {
    console.log('Affichage de l\'état de démarrage...');
    
    try {
        // Récactiver et afficher le bouton de démarrage
        if (elements.startQuizBtn) {
            elements.startQuizBtn.disabled = false;
            elements.startQuizBtn.textContent = 'Commencer le quiz';
            elements.startQuizBtn.style.display = ''; // S'assurer qu'il est visible
            console.log('Bouton de démarrage activé:', elements.startQuizBtn);
        } else {
            console.error('Le bouton startQuizBtn est introuvable dans le DOM');
        }
        
        // Afficher la section de démarrage et masquer les autres sections
        if (elements.quizStart) {
            elements.quizStart.classList.remove('hidden');
            elements.quizStart.style.display = '';
            console.log('Section de démarrage affichée');
        }
        
        // Masquer les autres sections du quiz
        const sectionsToHide = [
            elements.quizGame,
            elements.quizCompleted,
            elements.quizResults,
            document.getElementById('participationModal'),
            document.getElementById('shareModal')
        ];
        
        sectionsToHide.forEach(section => {
            if (section) {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        console.log('État de démarrage affiché avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'affichage de l\'état de démarrage:', error);
        // En cas d'erreur, on essaie au moins d'afficher la section de démarrage
        if (elements.quizStart) {
            elements.quizStart.classList.remove('hidden');
            elements.quizStart.style.display = '';
        }
    }
}

function showCompletedState() {
    console.log('Affichage de l\'état de quiz terminé...');
    
    try {
        // Désactiver le bouton de démarrage s'il existe
        if (elements.startQuizBtn) {
            elements.startQuizBtn.disabled = true;
            elements.startQuizBtn.textContent = 'Quiz terminé pour aujourd\'hui';
            console.log('Bouton de démarrage désactivé');
        }
        
        // Afficher la section de quiz terminé
        if (elements.quizCompleted) {
            elements.quizCompleted.classList.remove('hidden');
            elements.quizCompleted.style.display = '';
            console.log('Section de quiz terminé affichée');
            
            // Mettre à jour le message avec l'heure du dernier jeu si disponible
            if (userData?.lastPlayTime) {
                const lastPlayTime = new Date(userData.lastPlayTime);
                const timeOptions = { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                };
                const formattedTime = lastPlayTime.toLocaleTimeString('fr-FR', timeOptions);
                
                const completedMessage = elements.quizCompleted.querySelector('.quiz-completed-message');
                if (completedMessage) {
                    completedMessage.textContent = `Vous avez déjà joué aujourd'hui à ${formattedTime}. Revenez demain pour un nouveau quiz !`;
                    console.log('Message de quiz terminé mis à jour avec l\'heure:', formattedTime);
                }
            }
            
            // Mettre à jour le score d'aujourd'hui si disponible
            if (elements.todayScore) {
                elements.todayScore.textContent = `${userData.todayScore || 0}/10`;
                console.log('Score du jour mis à jour:', elements.todayScore.textContent);
            }
        }
        
        // Masquer les autres sections du quiz
        const sectionsToHide = [
            elements.quizStart,
            elements.quizGame,
            elements.quizResults,
            document.getElementById('participationModal'),
            document.getElementById('shareModal')
        ];
        
        sectionsToHide.forEach(section => {
            if (section) {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        console.log('État de quiz terminé affiché avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'affichage de l\'état de quiz terminé:', error);
        
        // En cas d'erreur, on essaie d'afficher un message d'erreur
        try {
            if (elements.quizCompleted) {
                elements.quizCompleted.classList.remove('hidden');
                elements.quizCompleted.style.display = '';
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Une erreur est survenue lors du chargement du quiz.';
                elements.quizCompleted.appendChild(errorMessage);
            }
        } catch (e) {
            console.error('Impossible d\'afficher le message d\'erreur:', e);
        }
    }
}

// ===== GESTION DES QUESTIONS =====
function getRandomQuestions(allQuestions, count) {
    // Mélange et sélection de questions aléatoires
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getDefaultQuestions() {
    // Questions par défaut si le fichier questions.js n'est pas chargé
    return [
        {
            question: "Quelle est l'arme d'assaut la plus populaire dans CODM ?",
            answers: ["AK-47", "M4", "AK-117", "Type 25"],
            correct: 0,
            category: "armes",
            difficulty: "facile"
        },
        {
            question: "Sur quelle carte se déroule le mode Battle Royale ?",
            answers: ["Nuketown", "Blackout", "Isolated", "Crash"],
            correct: 2,
            category: "battle-royale",
            difficulty: "facile"
        }
        // ... Autres questions par défaut
    ];
}

function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    if (!question) {
        console.error('❌ Question introuvable:', currentQuestionIndex);
        return;
    }
    
    // Mise à jour du texte de la question
    elements.questionText.textContent = question.question;
    
    // Mise à jour du compteur
    elements.currentQuestion.textContent = currentQuestionIndex + 1;
    
    // Mise à jour de la barre de progression
    const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    elements.progressFill.style.setProperty('--progress-width', `${progressPercent}%`);
    elements.progressFill.style.width = `${progressPercent}%`;
    
    // Génération des réponses
    displayAnswers(question.answers);
}

function displayAnswers(answers) {
    elements.answersContainer.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.setAttribute('data-answer', index);
        
        button.addEventListener('click', () => selectAnswer(index));
        
        elements.answersContainer.appendChild(button);
    });
}

function selectAnswer(answerIndex) {
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correct;
    
    // Sauvegarde de la réponse
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Mise à jour du score
    if (isCorrect) {
        quizScore++;
    }
    
    // Animation des boutons
    animateAnswerSelection(answerIndex, question.correct);
    
    // Passage à la question suivante après délai
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function animateAnswerSelection(selectedIndex, correctIndex) {
    const buttons = elements.answersContainer.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        
        if (index === selectedIndex) {
            btn.classList.add('selected');
        }
        
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            btn.classList.add('incorrect');
        }
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// ===== FIN DU QUIZ =====
function endQuiz() {
    quizEndTime = new Date();
    const timeSpent = Math.round((quizEndTime - quizStartTime) / 1000); // Temps en secondes
    
    // Sauvegarde des résultats avec le nouveau système
    saveQuizResults(timeSpent);
    
    // Affichage des résultats
    showResults();
    
    console.log(`🏆 Quiz terminé! Score: ${quizScore}/${currentQuestions.length}`);
}

function saveQuizResults(timeSpent) {
    // Préparation des données détaillées du quiz
    const quizResult = {
        score: quizScore,
        totalQuestions: currentQuestions.length,
        timeSpent: timeSpent,
        questions: currentQuestions.map((q, index) => ({
            question: q.question,
            userAnswer: userAnswers[index],
            correctAnswer: q.correct,
            isCorrect: userAnswers[index] === q.correct,
            category: q.category,
            difficulty: q.difficulty
        })),
        answers: userAnswers,
        difficulty: 'mixed' // Mélange de difficultés
    };
    
    // Sauvegarde via le système de stockage avancé
    const success = window.QuizStorage.saveQuiz(quizResult);
    
    if (success) {
        // Ajout du ticket de base pour avoir joué
        const ticketsEarned = window.QuizStorage.addTickets(1, 'quiz');
        userTickets = ticketsEarned;
        
        // Mise à jour des données utilisateur locales
        userData = window.QuizStorage.loadUser();
        
        // Mise à jour de l'interface
        updateUserInterface();
        
        console.log('✅ Résultats sauvegardés avec succès');
    } else {
        console.error('❌ Erreur lors de la sauvegarde des résultats');
    }
}

function showResults() {
    // Masquage du quiz en cours
    elements.quizGame?.classList.add('hidden');
    
    // Affichage des résultats
    elements.quizResults?.classList.remove('hidden');
    
    // Mise à jour du score
    elements.finalScore.textContent = `${quizScore}/10`;
    
    // Messages selon le score
    const { title, message } = getScoreMessage(quizScore);
    elements.resultsTitle.textContent = title;
    elements.resultsMessage.textContent = message;
}

function getScoreMessage(score) {
    if (score >= 9) {
        return {
            title: "LÉGENDAIRE ! 🔥",
            message: "Tu es un vrai expert de Call of Duty Mobile !"
        };
    } else if (score >= 7) {
        return {
            title: "EXCELLENT ! 👑",
            message: "Tu maîtrises vraiment CODM !"
        };
    } else if (score >= 5) {
        return {
            title: "BIEN JOUÉ ! 💪",
            message: "Pas mal, mais tu peux faire mieux !"
        };
    } else {
        return {
            title: "CONTINUE ! 🎯",
            message: "Reviens demain pour t'améliorer !"
        };
    }
}

// ===== ÉVÉNEMENTS =====
function setupEventListeners() {
    console.log('🔧 Configuration des écouteurs d\'événements...');
    
    // Vérification de l'élément startQuizBtn
    if (!elements.startQuizBtn) {
        console.log('[DEBUG] Recherche du bouton startQuizBtn dans le DOM...');
        elements.startQuizBtn = document.getElementById('startQuizBtn');
        if (!elements.startQuizBtn) {
            console.error('❌ ERREUR CRITIQUE: Impossible de trouver le bouton startQuizBtn');
            console.log('[DEBUG] État du DOM:', {
                'document.readyState': document.readyState,
                'elements.startQuizBtn': elements.startQuizBtn,
                'document.getElementById': document.getElementById('startQuizBtn')
            });
            return;
        } else {
            console.log('[DEBUG] Bouton startQuizBtn trouvé dans le DOM:', elements.startQuizBtn);
        }
    }
    
    // Supprimer d'abord tous les écouteurs existants
    console.log('[DEBUG] Clonage du bouton startQuizBtn...');
    const newBtn = elements.startQuizBtn.cloneNode(true);
    console.log('[DEBUG] Remplacement du bouton dans le DOM...');
    elements.startQuizBtn.parentNode.replaceChild(newBtn, elements.startQuizBtn);
    elements.startQuizBtn = newBtn;
    console.log('[DEBUG] Bouton cloné et remplacé avec succès');
    
    // Ajouter le nouvel écouteur
    console.log('[DEBUG] Ajout de l\'écouteur onclick au bouton...');
    elements.startQuizBtn.onclick = function(e) {
        console.log('🎯 [CLIC] Clic sur le bouton Commencer le quiz détecté');
        console.log('[DEBUG] État au moment du clic:', {
            'hasPlayedToday': hasPlayedToday,
            'elements.quizStart': elements.quizStart ? 'trouvé' : 'non trouvé',
            'elements.quizGame': elements.quizGame ? 'trouvé' : 'non trouvé',
            'window.questions': window.questions ? `Tableau de ${window.questions.length} questions` : 'non défini'
        });
        
        e.preventDefault();
        e.stopPropagation();
        
        try {
            startQuiz();
        } catch (error) {
            console.error('❌ ERREUR dans le gestionnaire de clic:', error);
            alert('Une erreur est survenue lors du démarrage du quiz. Veuillez réessayer.');
        }
        
        return false;
    };
    
    console.log('[DEBUG] Écouteur onclick attaché avec succès');
    
    // Activer le bouton
    elements.startQuizBtn.disabled = false;
    elements.startQuizBtn.style.cursor = 'pointer';
    
    // Autres écouteurs d'événements
    if (elements.participateBtn) {
        elements.participateBtn.addEventListener('click', openParticipationModal);
    }
    
    if (elements.shareScoreBtn) {
        elements.shareScoreBtn.addEventListener('click', openShareModal);
    }
    
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', openShareModal);
    }
    
    // Gestion des modales
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeParticipationModal);
    }
    
    if (elements.closeShareModal) {
        elements.closeShareModal.addEventListener('click', closeShareModal);
    }
    
    if (elements.participationModal) {
        elements.participationModal.addEventListener('click', (e) => {
            if (e.target === elements.participationModal) {
                closeParticipationModal();
            }
        });
    }
    
    if (elements.shareModal) {
        elements.shareModal.addEventListener('click', (e) => {
            if (e.target === elements.shareModal) {
                closeShareModal();
            }
        });
    }
    
    // Formulaire de participation
    if (elements.participationForm) {
        elements.participationForm.addEventListener('submit', handleParticipation);
    }
    
    console.log('✅ Tous les écouteurs d\'événements ont été initialisés');
}
    


function startQuiz() {
    console.log('🚀 [DEBUG] Démarrage du quiz...');
    console.log('[DEBUG] État au début de startQuiz:', {
        'hasPlayedToday': hasPlayedToday,
        'currentQuestions': currentQuestions ? `Tableau de ${currentQuestions.length} questions` : 'non défini',
        'window.questions': window.questions ? `Tableau de ${window.questions.length} questions` : 'non défini',
        'elements.quizStart': elements.quizStart ? 'trouvé' : 'non trouvé',
        'elements.quizGame': elements.quizGame ? 'trouvé' : 'non trouvé'
    });
    
    try {
        // Vérification des éléments nécessaires
        if (!elements.quizStart || !elements.quizGame) {
            throw new Error('Éléments du quiz manquants dans le DOM');
        }
        
        // Vérification si l'utilisateur a déjà joué aujourd'hui
        console.log('[DEBUG] Vérification de hasPlayedToday:', hasPlayedToday);
        if (hasPlayedToday) {
            console.log('ℹ️ L\'utilisateur a déjà joué aujourd\'hui');
            console.log('[DEBUG] Affichage du message d\'alerte...');
            alert('Tu as déjà joué aujourd\'hui ! Reviens demain 😊');
            return;
        }
        
        console.log('Vérification des questions disponibles...');
        if (!window.questions || !Array.isArray(window.questions) || window.questions.length === 0) {
            throw new Error('Aucune question disponible pour le quiz');
        }
        
        // Récupération de l'historique des questions
        let recentQuestions = [];
        if (window.QuizStorage && typeof window.QuizStorage.getQuizHistory === 'function') {
            console.log('Récupération de l\'historique des questions...');
            const history = window.QuizStorage.getQuizHistory(5) || [];
            history.forEach(qz => {
                if (qz.questions && Array.isArray(qz.questions)) {
                    qz.questions.forEach(q => {
                        if (q && q.question) {
                            recentQuestions.push(q.question);
                        }
                    });
                }
            });
        }
        
        // Sélection des questions
        console.log('Sélection des questions...');
        let pool = window.questions.filter(q => q && q.question && !recentQuestions.includes(q.question));
        
        // Si pas assez de nouvelles questions, on complète avec toutes
        if (pool.length < 10) {
            console.log('Pas assez de nouvelles questions, utilisation de toutes les questions disponibles');
            pool = [...window.questions];
        }
        
        // Mélange et sélection des questions
        console.log('Mélange des questions...');
        currentQuestions = window.QuizQuestions.shuffleArray(pool).slice(0, 10);
        
        // Vérification des questions sélectionnées
        if (currentQuestions.length === 0) {
            throw new Error('Aucune question valide sélectionnée pour le quiz');
        }
        
        // Réinitialisation des variables
        currentQuestionIndex = 0;
        userAnswers = [];
        quizScore = 0;
        quizStartTime = new Date();
        
        // Mise à jour de l'interface
        console.log('Mise à jour de l\'interface utilisateur...');
        elements.quizStart.classList.add('hidden');
        elements.quizGame.classList.remove('hidden');
        
        // Affichage de la première question
        console.log('Affichage de la première question...');
        displayQuestion();
        
        // Journalisation de l'activité
        if (window.QuizStorage && window.QuizStorage.storage) {
            console.log('Journalisation de l\'activité...');
            window.QuizStorage.storage.logActivity('quiz_started', {
                questionsCount: currentQuestions.length,
                startTime: quizStartTime.toISOString()
            });
        }
        
        console.log('✅ Quiz démarré avec succès');
        
    } catch (error) {
        console.error('❌ ERREUR lors du démarrage du quiz:', error);
        alert('Une erreur est survenue lors du démarrage du quiz. Veuillez réessayer.');
        
        // Réafficher le bouton de démarrage en cas d'erreur
        if (elements.quizStart && elements.quizGame) {
            elements.quizStart.classList.remove('hidden');
            elements.quizGame.classList.add('hidden');
        }
    }
}

// ===== GESTION DES MODALS =====
function openParticipationModal() {
    elements.participationModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeParticipationModal() {
    elements.participationModal?.classList.add('hidden');
    document.body.style.overflow = '';
}

function openShareModal() {
    elements.shareModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Génération du lien de parrainage si pas déjà fait
    if (typeof generateReferralLink === 'function') {
        generateReferralLink();
    }
}

function closeShareModal() {
    elements.shareModal?.classList.add('hidden');
    document.body.style.overflow = '';
}

// ===== NOTIFICATION ERREUR ACCESSIBLE =====
function showErrorNotification(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.setAttribute('tabindex', '-1');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.zIndex = '9999';
    errorDiv.style.background = 'rgba(60,10,10,0.98)';
    errorDiv.style.color = '#fff';
    errorDiv.style.padding = '2rem 2.5rem';
    errorDiv.style.borderRadius = '1.2em';
    errorDiv.style.boxShadow = '0 8px 32px #000b, 0 0 32px #ff5555bb';
    errorDiv.innerHTML = `
        <button class="close-error" aria-label="Fermer la notification" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#fff;cursor:pointer;">&times;</button>
        <div style="display:flex;flex-direction:column;align-items:center;">
            <span style="font-size:2.5rem;line-height:1;display:block;margin-bottom:.5rem;"><i class="fas fa-exclamation-triangle" aria-hidden="true" style="color:#ff5555;text-shadow:0 0 8px #ff5555;"></i></span>
            <h3 style="margin:1rem 0 .5rem 0;font-size:1.3rem;">Erreur</h3>
            <p style="margin-bottom:.7rem;font-size:1.1rem;">${message}</p>
        </div>
    `;
    document.body.appendChild(errorDiv);
    errorDiv.focus();
    // Fermeture manuelle
    const closeBtn = errorDiv.querySelector('.close-error');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => errorDiv.remove());
    }
    // Fermeture clavier (ESC)
    function handleEscClose(e) {
        if (e.key === 'Escape') {
            errorDiv.remove();
            document.removeEventListener('keydown', handleEscClose);
        }
    }
    document.addEventListener('keydown', handleEscClose);
    setTimeout(() => {
        if (document.body.contains(errorDiv)) errorDiv.remove();
    }, 7000);
}

// ===== GESTION DE LA PARTICIPATION =====
function handleParticipation(event) {
    event.preventDefault();

    // Rechargement des données utilisateur pour éviter la triche (valeurs live)
    let latestUserData;
    try {
        latestUserData = window.QuizStorage.loadUser();
    } catch (e) {
        showErrorNotification("Erreur de lecture du stockage. Veuillez réessayer ou changer de navigateur.");
        console.error("Erreur QuizStorage.loadUser:", e);
        return;
    }
    // Vérification stricte de la participation du jour
    const today = new Date().toDateString();
    if (latestUserData.lastPlayDate === today) {
        showErrorNotification("Tu as déjà participé aujourd'hui ! Reviens demain pour rejouer.");
        return;
    }

    const formData = new FormData(event.target);
    const participationData = {
        username: formData.get('username'),
        email: formData.get('email'),
        gdprConsent: formData.get('rgpdConsent') === 'on'
    };

    // Validation des données
    if (!participationData.username || !participationData.email || !participationData.gdprConsent) {
        alert('Veuillez remplir tous les champs et accepter la politique de confidentialité.');
        return;
    }

    // Attribution des tickets et sauvegarde, avec vérification d’intégrité
    let success = false;
    let ticketsAvant = latestUserData.totalTickets;
    let ticketsApres = ticketsAvant;
    try {
        // Appel sécurisé à QuizStorage
        success = window.QuizStorage.saveParticipation(participationData);
        // Rechargement pour synchro
        latestUserData = window.QuizStorage.loadUser();
        ticketsApres = latestUserData.totalTickets;
        userTickets = ticketsApres;
        userData = latestUserData;
        hasPlayedToday = (userData.lastPlayDate === today);
        updateUserInterface();
    } catch (e) {
        alert("Erreur lors de l'enregistrement de votre participation. Veuillez réessayer.");
        console.error("Erreur QuizStorage.saveParticipation:", e);
        return;
    }
    if (success && ticketsApres > ticketsAvant) {
        showParticipationSuccess();
        // Log de l'activité
        if (window.QuizStorage && window.QuizStorage.storage) {
            window.QuizStorage.storage.logActivity('participation_completed', {
                username: participationData.username,
                ticketsAvant,
                ticketsApres
            });
        }
        console.log('✅ Participation enregistrée avec succès, tickets gagnés:', ticketsApres - ticketsAvant);
    } else if (success && ticketsApres === ticketsAvant) {
        showErrorNotification("Participation enregistrée, mais aucun ticket supplémentaire attribué (déjà joué aujourd'hui ?)");
        console.warn('Participation enregistrée mais pas de gain de tickets.');
    } else {
        alert("Erreur lors de l'enregistrement de votre participation. Veuillez réessayer.");
        console.error('❌ Erreur lors de la participation');
    }
}

    event.preventDefault();
    
    const formData = new FormData(event.target);
    const participationData = {
        username: formData.get('username'),
        email: formData.get('email'),
        gdprConsent: formData.get('rgpdConsent') === 'on'
    };
    
    // Validation des données
    if (!participationData.username || !participationData.email || !participationData.gdprConsent) {
        alert('Veuillez remplir tous les champs et accepter la politique de confidentialité.');
        return;
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participationData.email)) {
        alert('Veuillez saisir une adresse email valide.');
        return;
    }
    
    // Enregistrement de la participation via le système de stockage
    const success = window.QuizStorage.participate(participationData);
    
    if (success) {
        // Fermeture du modal et affichage du succès
        closeParticipationModal();
        showParticipationSuccess();
        
        // Log de l'activité
        if (window.QuizStorage && window.QuizStorage.storage) {
            window.QuizStorage.storage.logActivity('participation_completed', {
                username: participationData.username,
                tickets: userTickets
            });
        }
        
        console.log('✅ Participation enregistrée avec succès');
    } else {
        showErrorNotification('Erreur lors de l\'enregistrement de votre participation. Veuillez réessayer.');
        console.error('❌ Erreur lors de la participation');
    }
// }

function showParticipationSuccess() {
    // Création d'un message de succès accessible et animé
    const successMessage = document.createElement('div');
    successMessage.className = 'success-notification visible animate-confetti';
    successMessage.setAttribute('role', 'alert');
    successMessage.setAttribute('aria-live', 'assertive');
    successMessage.setAttribute('tabindex', '-1');
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.zIndex = '9999';
    successMessage.style.background = 'rgba(30,35,60,0.98)';
    successMessage.style.color = '#fff';
    successMessage.style.padding = '2.5rem 2.5rem 2rem 2.5rem';
    successMessage.style.borderRadius = '1.2em';
    successMessage.style.boxShadow = '0 8px 32px #000b, 0 0 32px #50fa7b55';
    successMessage.innerHTML = `
        <button class="close-success" aria-label="Fermer la notification" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#fff;cursor:pointer;">&times;</button>
        <div style="display:flex;flex-direction:column;align-items:center;">
            <span style="font-size:2.5rem;line-height:1;display:block;margin-bottom:.5rem;"><i class="fas fa-trophy" aria-hidden="true" style="color:#ffe066;text-shadow:0 0 8px #50fa7b;"></i></span>
            <h3 style="margin:1rem 0 .5rem 0;font-size:1.6rem;">Participation enregistrée !</h3>
            <p style="margin-bottom:.7rem;font-size:1.15rem;">Score du jour : <strong class="score-glow" style="color:#fff;font-size:1.4em;text-shadow:0 0 8px #50fa7b,0 0 16px #ffe066;">${userData?.todayScore ?? 0}/10</strong></p>
            <p style="margin-bottom:.7rem;font-size:1.15rem;">Tickets cumulés : <strong class="tickets-glow" style="color:#fff;font-size:1.4em;text-shadow:0 0 8px #ffe066,0 0 16px #50fa7b;">${userTickets}</strong></p>
            <button class="share-score-btn" style="margin-top:1rem;padding:.6em 1.2em;font-size:1.1rem;font-weight:700;border-radius:.8em;background:linear-gradient(90deg,#50fa7b,#ffe066);color:#222;box-shadow:0 2px 8px #ffe06699;cursor:pointer;border:none;outline:none;transition:background 0.2s;">
                <i class="fas fa-share" style="margin-right:.5em;"></i>Partager mon score
            </button>
            <p style="margin-top:1.2rem;font-size:.98rem;opacity:.8;">Partage ton score pour gagner plus de tickets !</p>
        </div>
    `;
    document.body.appendChild(successMessage);
    // Focus auto pour accessibilité
    successMessage.focus();
    // Fermeture manuelle (croix)
    const closeBtn = successMessage.querySelector('.close-success');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => successMessage.remove());
    }
    // Fermeture clavier (ESC)
    function handleEscClose(e) {
        if (e.key === 'Escape') {
            successMessage.remove();
            document.removeEventListener('keydown', handleEscClose);
        }
    }
    document.addEventListener('keydown', handleEscClose);
    // Animation d'apparition
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    // Bouton partager mon score (ouvre le modal de partage natif si dispo)
    const shareBtn = successMessage.querySelector('.share-score-btn');
    if (shareBtn && typeof openShareModal === 'function') {
        shareBtn.addEventListener('click', openShareModal);
    }
    // Suppression automatique après 6 secondes (si pas fermé manuellement)
    setTimeout(() => {
        if (document.body.contains(successMessage)) successMessage.remove();
    }, 6000);
}

    // Création d'un message de succès temporaire
    const successMessage = document.createElement('div');
    successMessage.className = 'success-notification visible';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.zIndex = '9999';
    successMessage.style.background = 'rgba(30,35,60,0.98)';
    successMessage.style.color = '#fff';
    successMessage.style.padding = '2.5rem 2.5rem 2rem 2.5rem';
    successMessage.style.borderRadius = '1.5rem';
    successMessage.style.boxShadow = '0 6px 32px 0 rgba(0,0,0,0.25)';
    successMessage.style.textAlign = 'center';
    successMessage.style.fontSize = '1.25rem';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle" style="font-size:2.5rem;color:#5ee45e;"></i>
            <h3 style="margin:1rem 0 .5rem 0;">Participation enregistrée !</h3>
            <p>Score du jour : <strong>${userData?.todayScore ?? 0}/10</strong></p>
            <p>Tickets cumulés : <strong>${userTickets}</strong></p>
            <p style="margin-top:1rem;">Partage ton score pour gagner plus de tickets !</p>
        </div>
    `;
    document.body.appendChild(successMessage);
    // Animation d'apparition
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    // Suppression automatique après 6 secondes
    setTimeout(() => {
        successMessage.remove();
    }, 6000);
// }

// ===== MISE À JOUR DES STATISTIQUES =====
function updateStats() {
    // Mise à jour du compteur de questions
    if (elements.questionsCount && typeof window.questions !== 'undefined') {
        elements.questionsCount.textContent = window.questions.length;
    }
    
    // Autres statistiques depuis le système de stockage
    if (window.QuizStorage) {
        const analytics = window.QuizStorage.analytics();
        
        // Mise à jour des statistiques si disponibles
        console.log('📊 Analytics:', analytics);
    }
}

// ===== MENU MOBILE =====
function setupMobileMenu() {
    const burgerBtn = elements.burgerMenu;
    const overlay = elements.mobileOverlay;
    const mobileNav = elements.mobileNav;
    
    if (!burgerBtn || !overlay || !mobileNav) {
        console.warn('⚠️ Éléments du menu mobile introuvables');
        return;
    }
    
    // Toggle du menu
    burgerBtn.addEventListener('click', function() {
        const isActive = burgerBtn.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Fermeture via overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Fermeture via ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    elements.burgerMenu?.classList.add('active');
    elements.mobileOverlay?.classList.add('active');
    elements.mobileNav?.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    elements.burgerMenu?.classList.remove('active');
    elements.mobileOverlay?.classList.remove('active');
    elements.mobileNav?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ===== FONCTIONS UTILITAIRES =====
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function showStorageWarning() {
    const warning = document.createElement('div');
    warning.className = 'storage-warning';
    warning.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Mode dégradé</h3>
            <p>Le stockage local n'est pas disponible. Certaines fonctionnalités peuvent être limitées.</p>
        </div>
    `;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.remove();
    }, 5000);
}

// ===== EXPORT POUR DEBUG =====
window.QuizApp = {
    userData,
    currentQuestions,
    elements,
    
    // Fonctions utiles pour le debug
    getStats: () => window.QuizStorage?.analytics(),
    getTickets: () => userTickets,
    resetDaily: () => {
        hasPlayedToday = false;
        checkDailyQuizStatus();
    },
    // Permet de simuler un quiz terminé pour le debug
    completeQuiz: () => {
        quizScore = 8; // Simule un score de 8/10
        endQuiz();
    }
};

console.log('🎮 App.js chargé avec intégration storage.js complète!');
