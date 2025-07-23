// ===== QUESTIONS.JS - BASE DE DONNÉES QUESTIONS CODM =====

// ===== QUESTIONS CALL OF DUTY MOBILE =====
window.questions = [
    // ===== ARMES D'ASSAUT =====
    {
        question: "Quelle est l'arme d'assaut la plus populaire dans CODM ?",
        answers: ["AK-47", "M4", "AK-117", "Type 25"],
        correct: 0,
        category: "armes",
        difficulty: "facile"
    },
    {
        question: "Quelle arme d'assaut a le plus de dégâts par balle ?",
        answers: ["AK-47", "Man-O-War", "ASM10", "DR-H"],
        correct: 1,
        category: "armes",
        difficulty: "moyen"
    },
    {
        question: "Quel est le nom de l'AK-47 légendaire avec skin Dragon ?",
        answers: ["Red Action", "Steel Blue", "Wrath Black", "Tank"],
        correct: 0,
        category: "armes",
        difficulty: "difficile"
    },

    // ===== CARTES MULTIJOUEUR =====
    {
        question: "Sur quelle carte emblématique se trouve la maison au centre ?",
        answers: ["Nuketown", "Crash", "Crossfire", "Firing Range"],
        correct: 0,
        category: "cartes",
        difficulty: "facile"
    },
    {
        question: "Quelle carte se déroule dans un navire ?",
        answers: ["Hijacked", "Standoff", "Meltdown", "Takeoff"],
        correct: 0,
        category: "cartes",
        difficulty: "moyen"
    },
    {
        question: "Sur quelle carte trouve-t-on un hélicoptère crashé au centre ?",
        answers: ["Crash", "Crossfire", "Strike", "Backlot"],
        correct: 0,
        category: "cartes",
        difficulty: "facile"
    },

    // ===== BATTLE ROYALE =====
    {
        question: "Comment s'appelle la carte Battle Royale principale ?",
        answers: ["Blackout", "Verdansk", "Isolated", "Alcatraz"],
        correct: 2,
        category: "battle-royale",
        difficulty: "facile"
    },
    {
        question: "Combien de joueurs maximum dans un match Battle Royale ?",
        answers: ["80", "100", "120", "150"],
        correct: 1,
        category: "battle-royale",
        difficulty: "moyen"
    },
    {
        question: "Quelle classe Battle Royale permet de voir les ennemis à travers les murs ?",
        answers: ["Scout", "Ninja", "Medic", "Mechanic"],
        correct: 0,
        category: "battle-royale",
        difficulty: "moyen"
    },

    // ===== MODES DE JEU =====
    {
        question: "Dans quel mode doit-on planter/désamorcer une bombe ?",
        answers: ["Domination", "Recherche et Destruction", "Point Stratégique", "Mêlée Générale"],
        correct: 1,
        category: "modes",
        difficulty: "facile"
    },
    {
        question: "Quel mode de jeu se joue en 5v5 avec économie d'armes ?",
        answers: ["Ranked", "Battle Royale", "Multijoueur", "Mode Zombies"],
        correct: 0,
        category: "modes",
        difficulty: "moyen"
    },
    {
        question: "Dans quel mode les joueurs deviennent des zombies après leur mort ?",
        answers: ["Infection", "Gun Game", "Sticks and Stones", "One Shot One Kill"],
        correct: 0,
        category: "modes",
        difficulty: "facile"
    },

    // ===== PERSONNAGES / OPÉRATEURS =====
    {
        question: "Quel est le nom du personnage féminin le plus populaire ?",
        answers: ["Urban Tracker", "Seraph", "Outrider", "Battery"],
        correct: 0,
        category: "personnages",
        difficulty: "moyen"
    },
    {
        question: "Quel personnage porte un masque de crâne emblématique ?",
        answers: ["Ghost", "Price", "Soap", "Reznov"],
        correct: 0,
        category: "personnages",
        difficulty: "facile"
    },
    {
        question: "Quel opérateur est associé à la Task Force 141 ?",
        answers: ["Reznov", "Captain Price", "Prophet", "Ruin"],
        correct: 1,
        category: "personnages",
        difficulty: "moyen"
    },

    // ===== SCORESTREAKS =====
    {
        question: "Combien de points faut-il pour obtenir un UAV ?",
        answers: ["300", "400", "500", "600"],
        correct: 1,
        category: "scorestreaks",
        difficulty: "moyen"
    },
    {
        question: "Quel scorestreak permet de voir tous les ennemis sur la carte ?",
        answers: ["UAV", "Counter-UAV", "VTOL", "Advanced UAV"],
        correct: 3,
        category: "scorestreaks",
        difficulty: "difficile"
    },
    {
        question: "Quel est le scorestreak le plus puissant du jeu ?",
        answers: ["Cluster Strike", "VTOL", "Nuclear Bomb", "Chopper Gunner"],
        correct: 2,
        category: "scorestreaks",
        difficulty: "difficile"
    },

    // ===== ÉQUIPEMENTS ET GRENADES =====
    {
        question: "Quelle grenade permet de révéler les ennemis cachés ?",
        answers: ["Frag", "Concussion", "Sensor Dart", "Smoke"],
        correct: 2,
        category: "equipements",
        difficulty: "moyen"
    },
    {
        question: "Quel équipement tactique aveugle temporairement les ennemis ?",
        answers: ["EMP", "Flashbang", "Concussion", "Smoke"],
        correct: 1,
        category: "equipements",
        difficulty: "facile"
    },
    {
        question: "Quel équipement permet de se soigner rapidement ?",
        answers: ["Stim", "Trophy System", "Shield", "Trip Mine"],
        correct: 0,
        category: "equipements",
        difficulty: "facile"
    },

    // ===== ÉVÉNEMENTS ET SAISONS =====
    {
        question: "Comment s'appelle l'événement Halloween dans CODM ?",
        answers: ["Nightmare", "Dark Matter", "Halloween Hunt", "Undead Siege"],
        correct: 3,
        category: "evenements",
        difficulty: "moyen"
    },
    {
        question: "Quelle collaboration avec un anime a été la plus populaire ?",
        answers: ["Naruto", "Attack on Titan", "One Piece", "Dragon Ball"],
        correct: 1,
        category: "evenements",
        difficulty: "difficile"
    },

    // ===== ARMES SPÉCIALISÉES =====
    {
        question: "Quelle est la meilleure arme de sniper pour les débutants ?",
        answers: ["Arctic .50", "DL Q33", "Locus", "Outlaw"],
        correct: 0,
        category: "armes",
        difficulty: "moyen"
    },
    {
        question: "Quelle mitrailleuse légère a la plus haute cadence de tir ?",
        answers: ["RPD", "UL736", "Chopper", "M4LMG"],
        correct: 2,
        category: "armes",
        difficulty: "difficile"
    },

    // ===== GAMEPLAY GÉNÉRAL =====
    {
        question: "Quel est le niveau maximum qu'un joueur peut atteindre ?",
        answers: ["100", "150", "200", "Illimité"],
        correct: 3,
        category: "gameplay",
        difficulty: "moyen"
    },
    {
        question: "Comment s'appelle la monnaie premium du jeu ?",
        answers: ["COD Points", "Credits", "Tokens", "Coins"],
        correct: 0,
        category: "gameplay",
        difficulty: "facile"
    },
    {
        question: "Quel est le rang le plus élevé en mode Ranked ?",
        answers: ["Master", "Grand Master", "Legendary", "Mythic"],
        correct: 2,
        category: "gameplay",
        difficulty: "moyen"
    },

    // ===== QUESTIONS TECHNIQUES =====
    {
        question: "Quelle sensibilité est recommandée pour les débutants ?",
        answers: ["Très basse", "Basse", "Moyenne", "Élevée"],
        correct: 2,
        category: "technique",
        difficulty: "moyen"
    },
    {
        question: "Quel type de contrôle est le plus précis pour viser ?",
        answers: ["Gyroscope", "Tactile", "Manette", "Mixte"],
        correct: 3,
        category: "technique",
        difficulty: "difficile"
    },

    // ===== CULTURE CODM =====
    {
        question: "En quelle année Call of Duty Mobile a-t-il été lancé ?",
        answers: ["2018", "2019", "2020", "2021"],
        correct: 1,
        category: "general",
        difficulty: "moyen"
    }
];

// ===== FONCTIONS UTILITAIRES POUR LES QUESTIONS =====

/**
 * Obtient des questions par catégorie
 * @param {string} category - Catégorie des questions
 * @param {number} limit - Nombre maximum de questions
 * @returns {Array} Questions filtrées
 */
function getQuestionsByCategory(category, limit = 10) {
    const filtered = window.questions.filter(q => q.category === category);
    return shuffleArray(filtered).slice(0, limit);
}

/**
 * Obtient des questions par difficulté
 * @param {string} difficulty - Niveau de difficulté (facile, moyen, difficile)
 * @param {number} limit - Nombre maximum de questions
 * @returns {Array} Questions filtrées
 */
function getQuestionsByDifficulty(difficulty, limit = 10) {
    const filtered = window.questions.filter(q => q.difficulty === difficulty);
    return shuffleArray(filtered).slice(0, limit);
}

/**
 * Obtient un mélange équilibré de questions
 * @param {number} total - Nombre total de questions souhaitées
 * @returns {Array} Questions mélangées et équilibrées
 */
function getBalancedQuestions(total = 10) {
    const numFacile = Math.round(total * 0.4);
    const numMoyen = Math.round(total * 0.4);
    const numDifficile = total - numFacile - numMoyen; // Assure le bon nombre total

    const facile = getQuestionsByDifficulty('facile', numFacile);
    const moyen = getQuestionsByDifficulty('moyen', numMoyen);
    const difficile = getQuestionsByDifficulty('difficile', numDifficile);
    
    let combined = [...facile, ...moyen, ...difficile];

    // Si le nombre de questions est insuffisant, combler avec des questions faciles supplémentaires
    while (combined.length < total && window.questions.length > combined.length) {
        const extraEasy = getQuestionsByDifficulty('facile', 1); // Récupère une question facile
        combined = [...combined, ...extraEasy]; // Ajoute la question facile
    }
    
    return shuffleArray(combined).slice(0, total);
}

/**
 * Mélange un tableau de manière aléatoire (Fisher-Yates shuffle)
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} Tableau mélangé
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Obtient des statistiques sur les questions
 * @returns {Object} Statistiques détaillées
 */
function getQuestionsStats() {
    const stats = {
        total: window.questions.length,
        categories: {},
        difficulties: {}
    };
    
    window.questions.forEach(q => {
        // Comptage par catégorie
        stats.categories[q.category] = (stats.categories[q.category] || 0) + 1;
        
        // Comptage par difficulté
        stats.difficulties[q.difficulty] = (stats.difficulties[q.difficulty] || 0) + 1;
    });
    
    return stats;
}

/**
 * Valide les questions pour s'assurer qu'elles sont bien formées
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
function validateQuestions() {
    let isValid = true;
    const errors = [];
    
    window.questions.forEach((q, index) => {
        // Vérification des champs obligatoires
        if (!q.question || !q.answers || !q.hasOwnProperty('correct')) {
            errors.push(`Question ${index + 1}: Champs manquants`);
            isValid = false;
        }
        
        // Vérification du nombre de réponses
        if (q.answers && q.answers.length < 2) {
            errors.push(`Question ${index + 1}: Au moins 2 réponses requises`);
            isValid = false;
        }
        
        // Vérification de l'index de la bonne réponse
        if (q.correct >= q.answers.length || q.correct < 0) {
            errors.push(`Question ${index + 1}: Index de réponse correcte invalide`);
            isValid = false;
        }
    });
    
    if (!isValid) {
        console.error('❌ Erreurs dans les questions:', errors);
    } else {
        console.log('✅ Toutes les questions sont valides');
    }
    
    return { isValid, errors };
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Validation des questions au chargement
    const validation = validateQuestions();
    
    // Affichage des statistiques
    const stats = getQuestionsStats();
    console.log('📊 Statistiques des questions:', stats);
    
    // Mise à jour du compteur dans l'interface si l'élément existe
    const questionsCountElement = document.getElementById('questionsCount');
    if (questionsCountElement) {
        questionsCountElement.textContent = stats.total;
    }
    
    console.log('📚 Questions CODM chargées:', window.questions.length, 'questions disponibles');
});

// ===== EXPORT POUR DEBUG =====
window.QuizQuestions = {
    questions: window.questions,
    getQuestionsByCategory,
    getQuestionsByDifficulty,
    getBalancedQuestions,
    getQuestionsStats,
    validateQuestions,
    shuffleArray
};

console.log('📚 Questions.js chargé! ' + window.questions.length + ' questions disponibles');