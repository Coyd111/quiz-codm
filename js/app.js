/**
 * ===== QUIZ CODM - APPLICATION PRINCIPALE (VERSION CORRIGÉE ET COMPLÉTÉE) =====
 * Gestion du chargement, navigation et logique globale du quiz
 * Auteur: Coyd WILLZ
 */

// ===== CONFIGURATION GLOBALE =====
const APP_CONFIG = {
    loadingDuration: 1000, // 1 seconde de chargement
    animationDuration: 300,
    currentScreen: 'home-screen',
    currentQuestionIndex: 0,
    totalQuestions: 10,
    userScore: 0,
    quizStartTime: null,
    quizEndTime: null,
    selectedAnswers: [],
    isQuizActive: false,
    maxDailyPlays: 30, // Limite quotidienne (optionnelle)
    enableDailyLimit: false // Désactivé par défaut pour unlimited replays
};

// ===== ÉTAT DE L'APPLICATION =====
let appState = {
    isLoaded: false,
    currentQuiz: null,
    userAnswers: [],
    timeElapsed: 0,
    dailyPlayCount: 0,
    totalPlaysToday: 0
};

// ===== INITIALISATION DE L'APPLICATION =====

/**
 * Point d'entrée principal de l'application
 */
function initializeApp() {
    console.log('🎮 Initialisation Quiz CODM...');
    
    waitForDependencies()
        .then(() => {
            setupEventListeners();
            setupBackgroundImages();
            handleLoadingScreen();
            loadDailyStats();
            console.log('✅ Quiz CODM initialisé avec succès');
        })
        .catch(error => {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            hideLoadingScreen();
        });
}

/**
 * Attend que toutes les dépendances soient chargées
 */
function waitForDependencies() {
    return new Promise((resolve, reject) => {
        const maxWaitTime = 5000;
        const startTime = Date.now();
        
        function checkDependencies() {
            const now = Date.now();
            const dependenciesLoaded = 
                typeof CODM_IMAGES !== 'undefined' &&
                typeof QuizQuestions !== 'undefined' &&
                typeof QuizStorage !== 'undefined' &&
                document.readyState === 'complete';
            
            if (dependenciesLoaded) {
                resolve();
            } else if (now - startTime > maxWaitTime) {
                reject(new Error('Timeout: Dépendances non chargées'));
            } else {
                setTimeout(checkDependencies, 100);
            }
        }
        
        checkDependencies();
    });
}

// ===== GESTION DE L'ÉCRAN DE CHARGEMENT =====

function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    setTimeout(() => hideLoadingScreen(), APP_CONFIG.loadingDuration);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            appState.isLoaded = true;
            triggerAppLoadedEvent();
        }, 500);
    }
}

function triggerAppLoadedEvent() {
    const event = new CustomEvent('appLoaded', { detail: { timestamp: Date.now() } });
    document.dispatchEvent(event);
    console.log('🚀 Application entièrement chargée');
}

// ===== GESTION DES STATISTIQUES QUOTIDIENNES =====

function loadDailyStats() {
    if (typeof QuizStorage === 'undefined') return;
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('codm_stats_date');
    const savedCount = parseInt(localStorage.getItem('codm_daily_plays')) || 0;
    
    if (savedDate === today) {
        appState.totalPlaysToday = savedCount;
    } else {
        appState.totalPlaysToday = 0;
        localStorage.setItem('codm_stats_date', today);
        localStorage.setItem('codm_daily_plays', '0');
    }
    updatePlayCountDisplay();
}

function incrementDailyPlayCount() {
    appState.totalPlaysToday++;
    localStorage.setItem('codm_daily_plays', appState.totalPlaysToday.toString());
    updatePlayCountDisplay();
}

function updatePlayCountDisplay() {
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn && appState.totalPlaysToday > 0) {
        startBtn.innerHTML = `Rejouer le Quiz <small>(Partie #${appState.totalPlaysToday + 1})</small>`;
    }
}

// ===== GESTION DES IMAGES DE FOND =====

function setupBackgroundImages() {
    try {
        setMainBackground();
        setTimeout(() => {
            setQuizBackground();
            setResultsBackground();
        }, 100);
    } catch (error) {
        console.warn('Erreur configuration images:', error);
    }
}

function setMainBackground() {
    const heroSection = document.querySelector('#home-screen .hero-section');
    if (heroSection && typeof getBackgroundImage === 'function') {
        setBackgroundImage(heroSection, getBackgroundImage('home'));
    }
}

function setQuizBackground() {
    const quizScreen = document.getElementById('quiz-screen');
    if (quizScreen && typeof getBackgroundImage === 'function') {
        setBackgroundImage(quizScreen, getBackgroundImage('quiz'));
    }
}

function setResultsBackground() {
    const resultsScreen = document.getElementById('results-screen');
    if (resultsScreen && typeof getBackgroundImage === 'function') {
        setBackgroundImage(resultsScreen, getBackgroundImage('results'));
    }
}

// ===== NAVIGATION ENTRE ÉCRANS =====

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    setTimeout(() => {
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            APP_CONFIG.currentScreen = screenId;
        }
    }, 100);
}

// ===== ÉVÉNEMENTS ET INTERACTIONS =====

function setupEventListeners() {
    setupMainButtons();
    setupNavigationButtons();
    setupGlobalEvents();
    console.log('🎯 Événements configurés');
}

function setupMainButtons() {
    document.getElementById('start-quiz-btn')?.addEventListener('click', handleStartQuiz);
    document.getElementById('leaderboard-btn')?.addEventListener('click', handleShowLeaderboard);
    document.getElementById('share-score-btn')?.addEventListener('click', handleShareScore);
}

function setupNavigationButtons() {
    document.getElementById('quit-quiz-btn')?.addEventListener('click', handleQuitQuiz);
    document.getElementById('close-leaderboard-btn')?.addEventListener('click', handleCloseLeaderboard);
    document.getElementById('home-btn')?.addEventListener('click', handleGoHome);
    document.getElementById('replay-btn')?.addEventListener('click', handleReplay);
    document.getElementById('next-question-btn')?.addEventListener('click', handleNextQuestion);
}

function setupGlobalEvents() {
    window.addEventListener('resize', debounce(handleWindowResize, 300));
    document.addEventListener('appLoaded', handleAppLoaded);
}

// ===== GESTIONNAIRES D'ÉVÉNEMENTS =====

function handleStartQuiz() {
    if (!canStartQuiz()) {
        showDailyLimitMessage();
        return;
    }
    console.log('🎯 Démarrage du quiz');
    incrementDailyPlayCount();
    initializeQuizData();
    showScreen('quiz-screen');
    setTimeout(startQuiz, APP_CONFIG.animationDuration);
}

function handleShowLeaderboard() {
    console.log('🏆 Affichage du classement');
    // La logique de chargement du classement sera ajoutée ici
    showScreen('leaderboard-screen');
}

function handleShareScore() {
    // Récupérer les données du score à partager
    const scoreData = {
        score: appState.userScore,
        total: APP_CONFIG.totalQuestions,
        timeElapsed: appState.timeElapsed,
        playerName: appState.playerName || "Invité"
    };

    // Vérifier la présence du module de partage et ouvrir la modale
    if (window.QuizShare && typeof window.QuizShare.openShareModal === "function") {
        window.QuizShare.openShareModal(scoreData);
    } else {
        alert("Le module de partage n'est pas chargé !");
    }
}

function handleQuitQuiz() {
    if (confirm('Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.')) {
        resetQuizState();
        showScreen('home-screen');
    }
}

function handleCloseLeaderboard() {
    showScreen('home-screen');
}

function handleGoHome() {
    resetQuizState();
    showScreen('home-screen');
}

function handleReplay() {
    handleStartQuiz();
}

function handleWindowResize() {
    if (appState.isLoaded) setupBackgroundImages();
}

function handleAppLoaded(event) {
    console.log('🎉 Application prête:', event.detail);
    animateHomeScreen();
}

// ===== GESTION DU QUIZ =====

/**
 * Démarre une nouvelle session de quiz
 */
function startQuiz() {
    appState.currentQuiz = QuizQuestions.generateQuiz({ questionsCount: APP_CONFIG.totalQuestions });
    if (!appState.currentQuiz || appState.currentQuiz.questions.length === 0) {
        alert('Erreur: Impossible de charger les questions.');
        showScreen('home-screen');
        return;
    }
    console.log(`🚀 Quiz démarré avec ${appState.currentQuiz.questions.length} questions.`);
    displayQuestion();
}

/**
 * Affiche la question actuelle et ses réponses
 */
function displayQuestion() {
    // Réinitialiser l'explication à chaque nouvelle question
    const explanationDiv = document.getElementById('explanation');
    if (explanationDiv) {
        explanationDiv.textContent = '';
        explanationDiv.style.display = 'none';
    }
    const question = appState.currentQuiz.questions[APP_CONFIG.currentQuestionIndex];
    if (!question) {
        endQuiz();
        return;
    }

    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const questionCounter = document.getElementById('question-counter');
    const progressFill = document.getElementById('progress-fill');

    answersContainer.innerHTML = '';
    questionText.textContent = question.question;
    questionCounter.textContent = `${APP_CONFIG.currentQuestionIndex + 1}/${appState.currentQuiz.questions.length}`;
    
    const progressPercentage = ((APP_CONFIG.currentQuestionIndex + 1) / appState.currentQuiz.questions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-answer';
        button.textContent = answer;
        button.dataset.index = index;
        button.addEventListener('click', handleAnswerSelection);
        answersContainer.appendChild(button);
    });

    document.getElementById('next-question-btn').disabled = true;
}

/**
 * Gère la sélection d'une réponse par l'utilisateur
 * @param {Event} event - L'événement du clic
 */
function handleAnswerSelection(event) {
    const selectedButton = event.target;
    const selectedIndex = parseInt(selectedButton.dataset.index);
    const question = appState.currentQuiz.questions[APP_CONFIG.currentQuestionIndex];
    const correctIndex = question.correct;

    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) {
        APP_CONFIG.userScore++;
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('incorrect');
        // Montrer la bonne réponse
        const correctButton = document.querySelector(`.btn-answer[data-index='${correctIndex}']`);
        if (correctButton) correctButton.classList.add('correct');
    }

    // Afficher l’explication
    const explanationDiv = document.getElementById('explanation');
    if (question.explanation) {
        explanationDiv.textContent = question.explanation;
        explanationDiv.style.display = 'block';
    } else {
        explanationDiv.style.display = 'none';
    }

    // Désactiver tous les boutons de réponse
    document.querySelectorAll('.btn-answer').forEach(btn => btn.disabled = true);
    
    // Activer le bouton "Question Suivante"
    document.getElementById('next-question-btn').disabled = false;
}

/**
 * Gère le passage à la question suivante
 */
function handleNextQuestion() {
    APP_CONFIG.currentQuestionIndex++;
    if (APP_CONFIG.currentQuestionIndex < appState.currentQuiz.questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

/**
 * Termine le quiz et affiche les résultats
 */
function endQuiz() {
    APP_CONFIG.quizEndTime = Date.now();
    appState.timeElapsed = APP_CONFIG.quizEndTime - APP_CONFIG.quizStartTime;
    APP_CONFIG.isQuizActive = false;

    const scoreData = {
        playerName: QuizStorage.getUserName(),
        score: APP_CONFIG.userScore,
        questionsCount: appState.currentQuiz.questions.length,
        timeElapsed: appState.timeElapsed,
        category: appState.currentQuiz.metadata.category,
        difficulty: appState.currentQuiz.metadata.difficulty
    };

    QuizStorage.saveScore(scoreData);
    updateResultsScreen(scoreData);
    showScreen('results-screen');
    console.log('🏁 Quiz terminé!', scoreData);
}

/**
 * Met à jour l'écran des résultats avec les données finales
 * @param {Object} scoreData - Les données du score final
 */
function updateResultsScreen(scoreData) {
    const percentage = Math.round((scoreData.score / scoreData.questionsCount) * 100);
    document.getElementById('final-score').textContent = `${scoreData.score}/${scoreData.questionsCount}`;
    document.getElementById('correct-count').textContent = scoreData.score;
    document.getElementById('incorrect-count').textContent = scoreData.questionsCount - scoreData.score;
    document.getElementById('percentage').textContent = `${percentage}%`;

    let message = "Bien joué !";
    if (percentage < 50) message = "Vous pouvez faire mieux !";
    if (percentage >= 80) message = "Excellent score !";
    if (percentage === 100) message = "Parfait ! Vous êtes un expert !";
    document.getElementById('score-message').textContent = message;
}


// ===== FONCTIONS UTILITAIRES =====

function canStartQuiz() {
    return !APP_CONFIG.enableDailyLimit || appState.totalPlaysToday < APP_CONFIG.maxDailyPlays;
}

function initializeQuizData() {
    APP_CONFIG.currentQuestionIndex = 0;
    APP_CONFIG.userScore = 0;
    APP_CONFIG.quizStartTime = Date.now();
    APP_CONFIG.isQuizActive = true;
    appState.userAnswers = [];
}

function resetQuizState() {
    APP_CONFIG.isQuizActive = false;
    APP_CONFIG.currentQuestionIndex = 0;
    APP_CONFIG.userScore = 0;
}

function showDailyLimitMessage() {
    alert(`Limite quotidienne atteinte ! Revenez demain ! 🎮`);
}

function animateHomeScreen() {
    document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-stats, .btn')
        .forEach((el, index) => {
            setTimeout(() => el.classList.add('fade-in'), index * 150);
        });
}

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

// ===== EXPOSITION GLOBALE =====
window.QuizCODM = {
    initializeApp,
    showScreen,
    handleStartQuiz,
    APP_CONFIG,
    appState
};

// ===== INITIALISATION AUTOMATIQUE =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('🎮 Quiz CODM - Fichier app.js chargé');
