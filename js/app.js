// ===== APP.JS - LOGIQUE PRINCIPALE QUIZ CODM - VERSION INTÉGRÉE =====

// Import des autres modules
// Les autres fichiers JS seront chargés via les balises script dans l'HTML

// ===== VARIABLES GLOBALES =====
let currentQuestionIndex = 0;
let currentQuestions = [];
let userAnswers = [];
let quizScore = 0;
let quizStartTime = null;
let quizEndTime = null;
let hasPlayedToday = false;
let userTickets = 0;
let userData = null; // Ajout pour stocker les données utilisateur

// ===== ÉLÉMENTS DOM =====
const elements = {
    // Sections principales
    quizStart: document.getElementById('quizStart'),
    quizGame: document.getElementById('quizGame'),
    quizResults: document.getElementById('quizResults'),
    quizCompleted: document.getElementById('quizCompleted'),
    
    // Boutons principaux
    startQuizBtn: document.getElementById('startQuizBtn'),
    participateBtn: document.getElementById('participateBtn'),
    shareScoreBtn: document.getElementById('shareScoreBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Quiz en cours
    questionText: document.getElementById('questionText'),
    answersContainer: document.getElementById('answersContainer'),
    currentQuestion: document.getElementById('currentQuestion'),
    progressFill: document.getElementById('progressFill'),
    
    // Résultats
    finalScore: document.getElementById('finalScore'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsMessage: document.getElementById('resultsMessage'),
    
    // État terminé
    todayScore: document.getElementById('todayScore'),
    totalTickets: document.getElementById('totalTickets'),
    
    // Modals
    participationModal: document.getElementById('participationModal'),
    shareModal: document.getElementById('shareModal'),
    closeModal: document.getElementById('closeModal'),
    closeShareModal: document.getElementById('closeShareModal'),
    
    // Formulaire
    participationForm: document.getElementById('participationForm'),
    
    // Stats
    totalPlayers: document.getElementById('totalPlayers'),
    questionsCount: document.getElementById('questionsCount'),
    
    // Menu burger mobile
    burgerMenu: document.querySelector('.burger-menu'),
    mobileOverlay: document.querySelector('.mobile-overlay'),
    mobileNav: document.querySelector('.mobile-nav')
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Quiz CODM - Initialisation...');
    
    // Attendre que storage.js soit chargé
    if (typeof window.QuizStorage === 'undefined') {
        console.log('⏳ Attente du système de stockage...');
        setTimeout(() => {
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }, 100);
        return;
    }

    // Attendre que les modules de partage et parrainage soient chargés
    if (typeof window.quizShare === 'undefined' || typeof window.quizReferral === 'undefined') {
        console.log('⏳ Attente des modules de partage et parrainage...');
        setTimeout(() => {
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }, 100);
        return;
    }
    
    initializeApp();
    setupEventListeners();
    checkDailyQuizStatus();
    updateStats();
    setupMobileMenu();
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
    const today = new Date().toDateString();
    const lastPlayDate = userData.lastPlayDate;
    
    hasPlayedToday = (lastPlayDate === today);
    
    if (hasPlayedToday) {
        showCompletedState();
    } else {
        showStartState();
    }
}

function showStartState() {
    elements.quizStart?.classList.remove('hidden');
    elements.quizCompleted?.classList.add('hidden');
    elements.quizResults?.classList.add('hidden');
    elements.quizGame?.classList.add('hidden');
}

function showCompletedState() {
    elements.quizStart?.classList.add('hidden');
    elements.quizCompleted?.classList.remove('hidden');
    
    // Affichage du score d'aujourd'hui
    if (elements.todayScore) {
        elements.todayScore.textContent = `${userData.todayScore || 0}/10`;
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
    // Bouton démarrer le quiz
    elements.startQuizBtn?.addEventListener('click', startQuiz);
    
    // Boutons résultats
    elements.participateBtn?.addEventListener('click', openParticipationModal);
    elements.shareScoreBtn?.addEventListener('click', openShareModal);
    elements.shareBtn?.addEventListener('click', openShareModal);
    
    // Fermeture des modals
    elements.closeModal?.addEventListener('click', closeParticipationModal);
    elements.closeShareModal?.addEventListener('click', closeShareModal);
    
    // Clic sur l'overlay pour fermer les modals
    elements.participationModal?.addEventListener('click', (e) => {
        if (e.target === elements.participationModal) {
            closeParticipationModal();
        }
    });
    
    elements.shareModal?.addEventListener('click', (e) => {
        if (e.target === elements.shareModal) {
            closeShareModal();
        }
    });
    
    // Formulaire de participation
    elements.participationForm?.addEventListener('submit', handleParticipation);
}

function startQuiz() {
    if (hasPlayedToday) {
        alert('Tu as déjà joué aujourd\'hui ! Reviens demain 😊');
        return;
    }
    
    // Réinitialisation des variables
    currentQuestionIndex = 0;
    userAnswers = [];
    quizScore = 0;
    quizStartTime = new Date();
    
    // Affichage du quiz
    elements.quizStart?.classList.add('hidden');
    elements.quizGame?.classList.remove('hidden');
    
    // Affichage de la première question
    displayQuestion();
    
    // Log de l'activité
    if (window.QuizStorage && window.QuizStorage.storage) {
        window.QuizStorage.storage.logActivity('quiz_started', {
            questionsCount: currentQuestions.length,
            startTime: quizStartTime.toISOString()
        });
    }
    
    console.log('🚀 Quiz démarré avec système de tracking!');
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

// ===== GESTION DE LA PARTICIPATION =====
function handleParticipation(event) {
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
        alert('Erreur lors de l\'enregistrement de votre participation. Veuillez réessayer.');
        console.error('❌ Erreur lors de la participation');
    }
}

function showParticipationSuccess() {
    // Création d'un message de succès temporaire
    const successMessage = document.createElement('div');
    successMessage.className = 'success-notification';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Participation enregistrée !</h3>
            <p>Tu participes au tirage mensuel avec <strong>${userTickets} ticket(s)</strong></p>
            <p>Partage ton score pour gagner plus de tickets !</p>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Animation d'apparition
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

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
