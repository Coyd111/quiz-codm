/**
 * ===== QUIZ CODM - BASE DE QUESTIONS =====
 * Questions Call of Duty Mobile avec réponses
 * Auteur: Coyd WILLZ
 */

// ===== CONFIGURATION DES QUESTIONS =====
const QUIZ_CONFIG = {
    questionsPerQuiz: 10,
    totalAvailableQuestions: 15, // Sera étendu plus tard
    shuffleQuestions: true,
    shuffleAnswers: true,
    categories: ['armes', 'gameplay', 'personnages', 'saisons', 'maps']
};

// ===== BASE DE QUESTIONS CODM =====
const CODM_QUESTIONS = [
    {
        id: 1,
        question: "Quelle arme est considérée comme l'une des meilleures mitraillettes (SMG) en combat rapproché depuis la saison 10 ?",
        answers: ["QQ9", "GKS", "Chicom", "PDW-57"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "La QQ9 est reconnue pour sa cadence de tir élevée et sa mobilité excellente en combat rapproché."
    },
    {
        id: 2,
        question: "Quel fusil d'assaut a un mode rafale par défaut ?",
        answers: ["M4", "M16", "AK-47", "Man-O-War"],
        correct: 1,
        category: "armes",
        difficulty: "easy",
        explanation: "Le M16 tire en mode rafale à 3 coups, contrairement aux autres fusils d'assaut automatiques."
    },
    {
        id: 3,
        question: "Quel sniper inflige des dégâts mortels même en tirant dans le torse ?",
        answers: ["Arctic .50", "DL Q33", "XPR-50", "Koshka"],
        correct: 1,
        category: "armes",
        difficulty: "hard",
        explanation: "Le DL Q33 peut éliminer en un tir même avec un impact au torse, pas seulement à la tête."
    },
    {
        id: 4,
        question: "Quelle mitraillette possède une cadence de tir extrêmement rapide, mais un recul difficile à contrôler ?",
        answers: ["Fennec", "MSMC", "Razorback", "PP19 Bizon"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "La Fennec a la cadence de tir la plus élevée des SMG mais son recul est très difficile à maîtriser."
    },
    {
        id: 5,
        question: "Quelle arme dispose d'un double canon et est classée comme fusil à pompe ?",
        answers: ["BY15", "HS0405", "KRM-262", "R9-0"],
        correct: 3,
        category: "armes",
        difficulty: "medium",
        explanation: "Le R9-0 possède deux canons qui tirent simultanément, doublant les dégâts par coup."
    },
    {
        id: 6,
        question: "Quelle SMG possède un chargeur de base de 50 balles ?",
        answers: ["QQ9", "PP19 Bizon", "Fennec", "AGR 556"],
        correct: 1,
        category: "armes",
        difficulty: "easy",
        explanation: "La PP19 Bizon se distingue par son chargeur hélicoïdal de 50 balles sans accessoire."
    },
    {
        id: 7,
        question: "Le DR-H est redoutable grâce à :",
        answers: ["Son accessoire OTM Mag", "Son recul très bas", "Son silencieux intégré", "Son viseur thermique"],
        correct: 0,
        category: "armes",
        difficulty: "hard",
        explanation: "L'accessoire OTM Mag du DR-H augmente considérablement ses dégâts et sa portée."
    },
    {
        id: 8,
        question: "Quelle arme secondaire peut infliger des dégâts explosifs ?",
        answers: ["MW11", "J358", "Crossbow", "Renetti"],
        correct: 2,
        category: "armes",
        difficulty: "medium",
        explanation: "Le Crossbow peut être équipé de munitions explosives qui infligent des dégâts de zone."
    },
    {
        id: 9,
        question: "Parmi les snipers, lequel est réputé pour sa vitesse de visée (ADS) très rapide sans accessoire ?",
        answers: ["Arctic .50", "DL Q33", "XPR-50", "Locus"],
        correct: 3,
        category: "armes",
        difficulty: "medium",
        explanation: "Le Locus reste l’un des snipers les plus rapides en ADS, même sans accessoires améliorés."
    },
    {
        id: 10,
        question: "Le fusil de chasse KRM-262 est réputé pour :",
        answers: ["Son auto fire", "Son faible recul", "Son one-shot facile à courte distance", "Son silencieux intégré"],
        correct: 2,
        category: "armes",
        difficulty: "easy",
        explanation: "Le KRM-262 peut éliminer en un tir à courte distance avec un bon placement."
    },
    {
        id: 11,
        question: "Quelle arme possède une version mythique avec compteur de kills affiché en game ?",
        answers: ["Fennec", "Kilo 141", "QQ9", "Peacekeeper MK2"],
        correct: 3,
        category: "armes",
        difficulty: "hard",
        explanation: "La version mythique du Peacekeeper MK2 affiche un compteur de kills en temps réel pendant la partie."
    },
    {
        id: 12,
        question: "Le JAK-12 est :",
        answers: ["Un fusil à pompe automatique", "Une SMG", "Une LMG", "Une grenade spéciale"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "Le JAK-12 est un fusil à pompe entièrement automatique, unique en son genre dans CODM."
    },
    {
        id: 13,
        question: "Le fusil d'assaut AS VAL est connu pour :",
        answers: ["Son silencieux intégré", "Son énorme recul", "Son rechargement lent", "Être utilisable uniquement en Battle Royale"],
        correct: 0,
        category: "armes",
        difficulty: "easy",
        explanation: "L'AS VAL possède un silencieux intégré par défaut, ce qui le rend très discret."
    },
    {
        id: 14,
        question: "Quelle arme est équipée par défaut d'un viseur holographique ?",
        answers: ["Type 25", "AK117", "HVK-30", "M4"],
        correct: 2,
        category: "armes",
        difficulty: "medium",
        explanation: "L'HVK-30 est le seul fusil d'assaut avec un viseur holographique intégré dès le niveau 1."
    },
    {
        id: 15,
        question: "Le Rytec AMR se distingue par :",
        answers: ["Sa précision extrême", "Sa lunette thermique", "Ses balles explosives", "Son mode automatique"],
        correct: 2,
        category: "armes",
        difficulty: "hard",
        explanation: "Le Rytec AMR peut utiliser des munitions explosives qui infligent des dégâts de zone importants."
        },
    {
        id: 16,
        question: "Quelle mitraillette est connue pour sa précision et sa capacité à tirer en rafale ?",
        answers: ["GKS", "Fennec", "Chicom", "Pharo"],
        correct: 2,
        category: "armes",
        difficulty: "medium",
        explanation: "La Chicom est une SMG qui tire en rafale de 3 coups, idéale pour les combats rapprochés précis."
    },
    {
        id: 17,
        question: "Quelle LMG a été particulièrement populaire pour sa stabilité et son grand chargeur ?",
        answers: ["UL736", "RPD", "M4LMG", "Holger 26"],
        correct: 1,
        category: "armes",
        difficulty: "easy",
        explanation: "La RPD est connue pour sa stabilité, son recul faible et son énorme chargeur."
    },
    {
        id: 18,
        question: "Le Peacekeeper MK2 se distingue par :",
        answers: ["Un cadence de tir modérée mais très précis", "Un silencieux intégré", "Un recul très difficile", "Un mode rafale"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "Le Peacekeeper MK2 combine une excellente précision et de bons dégâts, surtout avec ses balles améliorées."
    },
    {
        id: 19,
        question: "Quel sniper est semi-automatique parmi ces choix ?",
        answers: ["DL Q33", "XPR-50", "Arctic .50", "Locus"],
        correct: 1,
        category: "armes",
        difficulty: "medium",
        explanation: "Le XPR-50 est un sniper semi-automatique, idéal pour enchaîner les tirs rapidement."
    },
    {
        id: 20,
        question: "Le Man-O-War est apprécié pour :",
        answers: ["Son faible recul", "Ses dégâts élevés", "Sa cadence de tir rapide", "Sa grande mobilité"],
        correct: 1,
        category: "armes",
        difficulty: "medium",
        explanation: "Le Man-O-War inflige de lourds dégâts, ce qui compense sa cadence modérée."
    },
    {
        id: 21,
        question: "Le M4 est surtout utilisé pour :",
        answers: ["Son énorme cadence", "Sa simplicité et sa stabilité", "Ses dégâts explosifs", "Ses tirs en rafale"],
        correct: 1,
        category: "armes",
        difficulty: "easy",
        explanation: "Le M4 est souvent recommandé aux débutants grâce à sa stabilité et son recul très faible."
    },
    {
        id: 22,
        question: "Quelle arme peut passer en mode entièrement automatique avec un accessoire ?",
        answers: ["M16", "Man-O-War", "Kilo 141", "ICR-1"],
        correct: 0,
        category: "armes",
        difficulty: "hard",
        explanation: "Le M16 peut devenir automatique avec le 'Wildfire' Perk via l’armurerie Gunsmith."
    },
    {
        id: 23,
        question: "Le HS0405 est un :",
        answers: ["SMG", "Fusil de précision", "Fusil à pompe", "LMG"],
        correct: 2,
        category: "armes",
        difficulty: "easy",
        explanation: "Le HS0405 est un fusil à pompe à canon long avec un fort potentiel de one-shot."
    },
    {
        id: 24,
        question: "Quelle LMG est appréciée pour son design modulaire et son efficacité en mode BR ?",
        answers: ["UL736", "Holger 26", "Chopper", "PKM"],
        correct: 1,
        category: "armes",
        difficulty: "medium",
        explanation: "La Holger 26 peut être modifiée en AR via Gunsmith, ce qui la rend très polyvalente en Battle Royale."
    },
    {
        id: 25,
        question: "La Razorback est une SMG caractérisée par :",
        answers: ["Une cadence ultra-rapide", "Un recul imprévisible", "Une très bonne précision", "Un chargeur explosif"],
        correct: 2,
        category: "armes",
        difficulty: "medium",
        explanation: "La Razorback se démarque par sa précision constante, même sans accessoires."
    },
    {
        id: 26,
        question: "Quelle arme est souvent considérée comme très polyvalente en multijoueur ?",
        answers: ["Type 25", "AK117", "ICR-1", "ASM10"],
        correct: 1,
        category: "armes",
        difficulty: "easy",
        explanation: "L’AK117 est rapide, stable et efficace à toutes distances, idéale en multijoueur."
    },
    {
        id: 27,
        question: "La grenade C4 est :",
        answers: ["Une arme secondaire explosive", "Une arme principale", "Un bonus de série", "Un accessoire de scorestreak"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "Le C4 est une grenade collante pouvant être déclenchée manuellement."
    },
    {
        id: 28,
        question: "Quelle arme est réputée pour être très puissante mais avec un gros recul vertical ?",
        answers: ["ASM10", "ICR-1", "M4", "Peacekeeper MK2"],
        correct: 0,
        category: "armes",
        difficulty: "medium",
        explanation: "L’ASM10 inflige de gros dégâts mais nécessite de bien contrôler le recul vertical."
    },
    {
        id: 29,
        question: "Quelle SMG tire en rafales de 4 coups ?",
        answers: ["Chicom", "Pharo", "QQ9", "MSMC"],
        correct: 1,
        category: "armes",
        difficulty: "medium",
        explanation: "La Pharo tire en rafales de 4 balles et peut être très létale avec précision."
    },
    {
        id: 30,
        question: "Le RPD est souvent équipé de quel accessoire pour améliorer sa visée ?",
        answers: ["Chargeur rapide", "Viseur laser MIP", "Poignée tactique", "Crosse RTC stable"],
        correct: 1,
        category: "armes",
        difficulty: "medium",
        explanation: "Le viseur laser MIP améliore la précision en visée mobile avec le RPD."
    },
    {
    id: 31,
    question: "Quel pistolet-mitrailleur possède une variante légendaire très populaire avec effet de traînée ?",
    answers: ["QQ9", "Fennec", "MSMC", "AGR 556"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Fennec a une variante légendaire populaire avec effet visuel de traînée, très appréciée par les joueurs."
},
{
    id: 32,
    question: "Quelle arme est célèbre pour sa cadence extrême et son double canon ?",
    answers: ["HS0405", "Fennec Akimbo", "R9-0", "JAK-12"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Le R9-0 possède deux canons pouvant tirer en succession rapide, rendant sa cadence très redoutable."
},
{
    id: 33,
    question: "Quelle LMG possède la capacité d'être utilisée comme une AR grâce au Gunsmith ?",
    answers: ["Chopper", "UL736", "Holger 26", "PKM"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "La Holger 26 est l'une des seules LMG pouvant se transformer en fusil d’assaut via les accessoires Gunsmith."
},
{
    id: 34,
    question: "La PDW-57 est reconnue pour :",
    answers: ["Sa portée longue", "Son silence natif", "Son gros chargeur et sa stabilité", "Son mode rafale"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "La PDW-57 est une SMG très stable avec un grand chargeur de base, appréciée pour sa simplicité."
},
{
    id: 35,
    question: "Quelle arme utilise des carreaux explosifs comme munition spéciale ?",
    answers: ["Crossbow", "KRM-262", "Rytec AMR", "XPR-50"],
    correct: 0,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Crossbow peut être équipé de carreaux explosifs qui infligent des dégâts de zone importants."
},
{
    id: 36,
    question: "Le HBRa3 est un fusil :",
    answers: ["À rafale", "À visée thermique", "Automatique et équilibré", "Semi-automatique"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le HBRa3 est un fusil d’assaut automatique avec une bonne polyvalence et une maniabilité appréciée."
},
{
    id: 37,
    question: "Quelle arme est exclusive à certaines saisons et difficilement obtenable hors événement ?",
    answers: ["AK-117", "Peacekeeper MK2", "S36", "MX9"],
    correct: 3,
    category: "armes",
    difficulty: "medium",
    explanation: "Le MX9 est une SMG souvent liée à des événements spécifiques et rarement disponible en boutique."
},
{
    id: 38,
    question: "Quelle arme secondaire est idéale pour finir un ennemi à courte distance ?",
    answers: ["MW11", "J358", "Knife", "Renetti"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le couteau (Knife) permet une élimination instantanée à très courte distance."
},
{
    id: 39,
    question: "Quelle SMG a une cadence faible mais une excellente précision à longue distance ?",
    answers: ["AGR 556", "Razorback", "GKS", "Chicom"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "La GKS est connue pour sa précision et sa portée, idéale pour du combat mi-distance."
},
{
    id: 40,
    question: "Quelle est l'une des principales forces du Kilo 141 ?",
    answers: ["Sa cadence explosive", "Sa précision exceptionnelle", "Son viseur thermique intégré", "Son rechargement rapide"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Kilo 141 offre une grande précision et constance, très fiable même sans accessoires."
},
{
    id: 41,
    question: "Le sniper Rytec AMR peut utiliser quel type de munitions uniques ?",
    answers: ["Explosives", "Silencieuses", "Incendiaires", "Radar"],
    correct: 0,
    category: "armes",
    difficulty: "hard",
    explanation: "Le Rytec AMR est l’un des rares snipers pouvant tirer des balles explosives."
},
{
    id: 42,
    question: "Quel fusil de précision est conseillé pour les tirs rapides en enchaînement ?",
    answers: ["DL Q33", "XPR-50", "Locus", "Arctic .50"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le XPR-50 est semi-automatique, parfait pour les tirs enchaînés à courte ou moyenne distance."
},
{
    id: 43,
    question: "La GKS peut être améliorée avec quel accessoire unique ?",
    answers: ["Kit rafale", "Silencieux intégré", "Chargeur grande capacité", "Viseur thermique"],
    correct: 0,
    category: "armes",
    difficulty: "medium",
    explanation: "La GKS peut tirer en rafales de 4 coups avec le kit spécifique disponible dans le Gunsmith."
},
{
    id: 44,
    question: "Quel fusil d’assaut est réputé pour sa cadence extrêmement rapide ?",
    answers: ["ICR-1", "AK-117", "Type 25", "Man-O-War"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le Type 25 possède l’une des cadences les plus rapides des fusils d’assaut en multijoueur."
},
{
    id: 45,
    question: "Quelle arme mythique possède des effets sonores et visuels uniques ?",
    answers: ["AK-47", "Peacekeeper MK2", "Fennec", "ASM10"],
    correct: 1,
    category: "armes",
    difficulty: "hard",
    explanation: "La version mythique du Peacekeeper MK2 inclut des effets sonores, visuels et même un kill counter."
        },
{
    id: 46,
    question: "Quelle arme a été introduite comme récompense d'événement lors de la Saison 11 2023 ?",
    answers: ["Kilo 141", "AGR 556", "M13", "Oden"],
    correct: 3,
    category: "armes",
    difficulty: "hard",
    explanation: "L’Oden, un fusil d’assaut à très hautes performances, a été introduit comme récompense lors d’un événement de la saison 11 2023."
},
{
    id: 47,
    question: "Le MSMC est reconnu pour :",
    answers: ["Sa longue portée", "Sa stabilité à longue distance", "Sa cadence extrêmement rapide", "Son recul maîtrisé"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le MSMC possède une cadence de tir très rapide, mais difficile à contrôler sans accessoire."
},
{
    id: 48,
    question: "Quelle arme est idéale pour les tirs à la tête en mode multijoueur grâce à sa précision ?",
    answers: ["ICR-1", "ASM10", "Peacekeeper MK2", "Type 25"],
    correct: 0,
    category: "armes",
    difficulty: "medium",
    explanation: "L’ICR-1 est très stable et précise, ce qui la rend idéale pour viser la tête en multijoueur."
},
{
    id: 49,
    question: "Quelle SMG possède un mode rafale de base ?",
    answers: ["QQ9", "Chicom", "Pharo", "Fennec"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "La Pharo est une SMG qui tire automatiquement en rafales de 4 balles."
},
{
    id: 50,
    question: "Quelle arme légendaire introduite en 2022 a un thème d'énergie futuriste ?",
    answers: ["Fennec Ascended", "M13 Morningstar", "Man-O-War Cardinal", "RPD Orbit"],
    correct: 1,
    category: "armes",
    difficulty: "hard",
    explanation: "Le M13 Morningstar est une arme légendaire avec un thème futuriste, incluant effets lumineux et animations spéciales."
},
{
    id: 51,
    question: "Quelle arme lourde est la plus utilisée en mode Zombie grâce à son gros chargeur ?",
    answers: ["UL736", "PKM", "RPD", "Chopper"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "La RPD avec son gros chargeur et sa stabilité est parfaite pour le mode Zombie."
},
{
    id: 52,
    question: "Quelle SMG est équipée par défaut d’un viseur laser visible ?",
    answers: ["AGR 556", "Fennec", "QQ9", "MSMC"],
    correct: 0,
    category: "armes",
    difficulty: "medium",
    explanation: "L’AGR 556 est livrée avec un viseur laser intégré qui améliore la précision de tir à la hanche."
},
{
    id: 53,
    question: "Quel est l’avantage principal du DL Q33 par rapport à d’autres snipers ?",
    answers: ["Temps de visée ultra rapide", "Aucun recul", "Kill instantané sur le torse", "Tir automatique"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Le DL Q33 inflige des dégâts mortels au torse, ce qui en fait un des snipers les plus redoutés."
},
{
    id: 54,
    question: "Quelle arme a une version mythique 'Divine Smite' ?",
    answers: ["Kilo 141", "Holger 26", "Peacekeeper MK2", "DL Q33"],
    correct: 3,
    category: "armes",
    difficulty: "hard",
    explanation: "Le DL Q33 Divine Smite est une version mythique très recherchée avec effets visuels divins."
},
{
    id: 55,
    question: "Le Chopper est un LMG avec une particularité unique, laquelle ?",
    answers: ["Tir automatique très rapide mais sans viseur", "Recharge automatique après chaque tir", "Cadence ultra lente", "Mode rafale activé d'origine"],
    correct: 0,
    category: "armes",
    difficulty: "hard",
    explanation: "Le Chopper est un LMG qui peut tirer de manière extrêmement rapide mais sans viseur par défaut, à manier en tir à la hanche."
},
{
    id: 56,
    question: "Quelle mitraillette est recommandée en Battle Royale pour sa portée et sa cadence ?",
    answers: ["QQ9", "GKS", "AGR 556", "Fennec"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "L’AGR 556 est une SMG stable et efficace à moyenne distance, idéale en Battle Royale."
},
{
    id: 57,
    question: "Le couteau balistique (Ballistic Knife) permet :",
    answers: ["Des attaques explosives", "Des tirs à distance silencieux", "Des tirs de feu", "Des attaques au C4"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Ballistic Knife peut tirer des lames silencieuses à distance, utile pour les éliminations discrètes."
},
{
    id: 58,
    question: "Quelle arme a une version mythique avec ailes d’ange et effets sonores célestes ?",
    answers: ["Type 25", "AK117", "Peacekeeper MK2", "Kilo 141"],
    correct: 3,
    category: "armes",
    difficulty: "hard",
    explanation: "La version mythique du Kilo 141 'Demon Song' intègre des effets visuels et sonores angéliques."
},
{
    id: 59,
    question: "Quel revolver est célèbre pour son énorme puissance de tir ?",
    answers: ["J358", "MW11", "Renetti", "Crossbow"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "Le J358 est un revolver puissant capable d’éliminer un ennemi avec un bon tir bien placé."
},
{
    id: 60,
    question: "Le RUS-79U est une SMG qui se distingue par :",
    answers: ["Un mode automatique stable", "Son recul vertical extrême", "Un mode rafale par défaut", "Une vitesse de rechargement ultra lente"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "Le RUS-79U est une SMG automatique fiable, facile à prendre en main et stable même sans accessoire."
        },
{
    id: 61,
    question: "Quelle arme est inspirée du fusil russe AK-12 ?",
    answers: ["AK117", "ASM10", "KN-44", "FR.556"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Le KN-44 est inspiré de l’AK-12 et offre un bon compromis entre stabilité et dégâts."
},
{
    id: 62,
    question: "La M13 est particulièrement efficace grâce à :",
    answers: ["Son faible recul", "Sa capacité de tir explosif", "Son silencieux intégré", "Son tir par rafales uniquement"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "La M13 combine une cadence élevée et un recul très faible, idéale pour les combats rapprochés et moyens."
},
{
    id: 63,
    question: "Quelle arme secondaire est souvent utilisée en multijoueur pour des kills rapides à courte portée ?",
    answers: ["Renetti", "J358", "Shorty", "MW11"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Shorty est un fusil à pompe compact qui permet des kills instantanés à courte distance."
},
{
    id: 64,
    question: "Le Kilo Bolt-Action est un hybride entre :",
    answers: ["Fusil de précision et fusil à pompe", "SMG et sniper", "AR et DMR", "Fusil d’assaut et sniper"],
    correct: 3,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Kilo Bolt-Action fonctionne comme un sniper rapide avec une mobilité proche des AR."
},
{
    id: 65,
    question: "Quelle LMG se distingue par sa mobilité améliorée ?",
    answers: ["UL736", "PKM", "Holger 26", "M4LMG"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "La Holger 26 peut être modifiée pour ressembler à un AR, augmentant ainsi sa mobilité."
},
{
    id: 66,
    question: "La Type 25 a longtemps été connue pour :",
    answers: ["Son mode rafale", "Sa cadence extrême", "Son rechargement très lent", "Son recul incontrôlable"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "La Type 25 est célèbre pour sa cadence de tir très élevée, utile pour rusher."
},
{
    id: 67,
    question: "Le SVD est un :",
    answers: ["Sniper semi-auto", "Fusil à pompe", "AR modifié", "SMG longue portée"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "Le SVD est un fusil de précision semi-automatique, parfait pour enchaîner les tirs rapides."
},
{
    id: 68,
    question: "Quelle arme mythique est surnommée 'Ascended' ?",
    answers: ["Peacekeeper MK2", "Fennec", "RUS-79U", "Kilo 141"],
    correct: 1,
    category: "armes",
    difficulty: "hard",
    explanation: "La Fennec Ascended est une version mythique célèbre avec des effets visuels impressionnants."
},
{
    id: 69,
    question: "La QQ9 est souvent comparée à quelle arme de la série Modern Warfare ?",
    answers: ["MP5", "UMP45", "Vector", "MP7"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "La QQ9 est la version CODM de la célèbre MP5, une SMG compacte et efficace."
},
{
    id: 70,
    question: "Quelle arme dispose de la cadence de tir la plus élevée parmi les fusils d’assaut ?",
    answers: ["M13", "Type 25", "AK117", "Peacekeeper MK2"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "La Type 25 possède la cadence de tir la plus rapide parmi les AR, ce qui la rend redoutable en combat rapproché."
},
{
    id: 71,
    question: "Le DL Q33 est :",
    answers: ["Un sniper semi-automatique", "Un sniper bolt-action", "Un fusil à pompe lourd", "Une SMG camouflée"],
    correct: 1,
    category: "armes",
    difficulty: "easy",
    explanation: "Le DL Q33 est un sniper bolt-action redouté pour ses dégâts élevés."
},
{
    id: 72,
    question: "Le M4LMG est une version lourde de :",
    answers: ["ICR-1", "M4", "AK47", "Man-O-War"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le M4LMG partage sa base avec le M4, mais dispose d’un chargeur plus important et de meilleure portée."
},
{
    id: 73,
    question: "Quelle SMG se caractérise par sa grande précision même sans accessoire ?",
    answers: ["GKS", "Chicom", "Fennec", "QQ9"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "La GKS est très stable, même sans attache, et tire en automatique."
},
{
    id: 74,
    question: "Le Rytec AMR peut être équipé de :",
    answers: ["Balles incendiaires", "Balles explosives", "Silencieux thermique", "Chargeur double"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Rytec AMR est un sniper unique capable d’utiliser des munitions explosives."
},
{
    id: 75,
    question: "Le Man-O-War est parfois jugé lent à cause de :",
    answers: ["Son animation de rechargement", "Son poids", "Sa cadence de tir", "Son zoom trop long"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Malgré sa puissance, le Man-O-War a une cadence relativement lente par rapport à d'autres AR."
        },
{
    id: 76,
    question: "Quelle arme est réputée pour son efficacité en duel à moyenne distance, surtout en mode classé ?",
    answers: ["ICR-1", "ASM10", "Kilo 141", "HVK-30"],
    correct: 3,
    category: "armes",
    difficulty: "medium",
    explanation: "Le HVK-30, grâce à son accessoire à munitions puissantes, est redoutable à moyenne distance."
},
{
    id: 77,
    question: "Quel pistolet possède un mode rafale par défaut ?",
    answers: ["MW11", "J358", "Renetti", "Shorty"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le Renetti peut tirer en rafale de 3 balles, ce qui en fait une arme secondaire puissante."
},
{
    id: 78,
    question: "La KN-44 est populaire pour :",
    answers: ["Son recul très stable", "Sa cadence extrême", "Son silencieux intégré", "Ses dégâts explosifs"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "La KN-44 combine dégâts corrects et excellent contrôle du recul, la rendant fiable."
},
{
    id: 79,
    question: "Quelle SMG peut être équipée d’un chargeur à haute capacité (80 balles) ?",
    answers: ["PP19 Bizon", "Fennec", "AGR 556", "MSMC"],
    correct: 0,
    category: "armes",
    difficulty: "medium",
    explanation: "Le PP19 Bizon peut atteindre 80 balles avec l’accessoire adéquat, ce qui prolonge l’engagement sans recharger."
},
{
    id: 80,
    question: "Le Locus est surtout apprécié pour :",
    answers: ["Sa puissance brute", "Sa mobilité et sa vitesse de visée", "Sa capacité à tirer en rafale", "Son chargeur explosif"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Locus est très rapide en visée et permet de quickscope efficacement."
},
{
    id: 81,
    question: "Le XPR-50 est désavantagé par :",
    answers: ["Son manque de munitions", "Sa cadence trop lente", "Son faible potentiel de one-shot", "Son bruit trop fort"],
    correct: 2,
    category: "armes",
    difficulty: "hard",
    explanation: "En tant que sniper semi-auto, le XPR-50 inflige moins de dégâts et peine à éliminer en un coup."
},
{
    id: 82,
    question: "Quelle arme est inspirée de la célèbre G36C ?",
    answers: ["ICR-1", "Peacekeeper MK2", "M13", "HVK-30"],
    correct: 0,
    category: "armes",
    difficulty: "easy",
    explanation: "L’ICR-1 est la version CODM de la G36C, reconnue pour sa stabilité et sa précision."
},
{
    id: 83,
    question: "Le M21 EBR est un :",
    answers: ["Sniper bolt-action", "Sniper semi-auto", "Fusil d’assaut à lunette", "SMG longue portée"],
    correct: 1,
    category: "armes",
    difficulty: "easy",
    explanation: "Le M21 EBR est un sniper semi-automatique permettant des tirs enchaînés rapides."
},
{
    id: 84,
    question: "Quelle arme peut équiper un lance-grenade sous le canon ?",
    answers: ["AK117", "Man-O-War", "M4", "FR.556"],
    correct: 3,
    category: "armes",
    difficulty: "medium",
    explanation: "Le FR.556 est le seul fusil d’assaut pouvant utiliser un lance-grenade via Gunsmith."
},
{
    id: 85,
    question: "Le Chopper est une LMG qui se distingue par :",
    answers: ["Un recul extrême", "Un mode tir continu sans visée", "Un silencieux intégré", "Un mode semi-automatique"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "Le Chopper permet de tirer en mouvement avec précision sans viser, ce qui est unique parmi les LMG."
},
{
    id: 86,
    question: "Quelle SMG est surnommée la 'Laser SMG' pour sa précision ?",
    answers: ["GKS", "AGR 556", "MSMC", "RUS-79U"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "L’AGR 556 est surnommée 'Laser SMG' pour sa précision et sa stabilité même en mouvement."
},
{
    id: 87,
    question: "Le M16 est peu utilisé car :",
    answers: ["Son rechargement est trop long", "Il est trop bruyant", "Le mode rafale est peu efficace en combat rapide", "Il inflige des dégâts trop faibles"],
    correct: 2,
    category: "armes",
    difficulty: "medium",
    explanation: "Le M16, en mode rafale, est difficile à utiliser efficacement en combat rapproché rapide."
},
{
    id: 88,
    question: "Quel fusil d’assaut dispose d’un mode semi-auto de base ?",
    answers: ["FR.556", "M4", "Kilo 141", "SKS"],
    correct: 3,
    category: "armes",
    difficulty: "hard",
    explanation: "Le SKS est un fusil DMR à tir semi-automatique par défaut, infligeant de gros dégâts avec précision."
},
{
    id: 89,
    question: "Le PKM est souvent utilisé pour :",
    answers: ["Sa mobilité extrême", "Son faible recul", "Sa capacité de suppression prolongée", "Ses munitions explosives"],
    correct: 2,
    category: "armes",
    difficulty: "easy",
    explanation: "Le PKM a un grand chargeur et une excellente capacité de feu soutenu, utile pour verrouiller une zone."
},
{
    id: 90,
    question: "La Koshka se distingue des autres snipers par :",
    answers: ["Sa précision extrême", "Sa mobilité accrue et visée rapide", "Sa capacité à tirer en rafale", "Son chargeur de 10 balles"],
    correct: 1,
    category: "armes",
    difficulty: "medium",
    explanation: "La Koshka a une excellente mobilité et une animation rapide, ce qui la rend redoutable pour le quickscope."
        },
{
    id: 91,
    question: "Quelle carte emblématique est inspirée d’un cargo en pleine mer ?",
    answers: ["Shipment", "Hijacked", "Crash", "Terminal"],
    correct: 1,
    category: "cartes",
    difficulty: "easy",
    explanation: "Hijacked se déroule sur un yacht de luxe, souvent en mer, très populaire pour les combats rapprochés."
},
{
    id: 92,
    question: "Sur quelle carte trouve-t-on un hélicoptère écrasé au centre ?",
    answers: ["Crash", "Raid", "Takeoff", "Meltdown"],
    correct: 0,
    category: "cartes",
    difficulty: "easy",
    explanation: "Crash est célèbre pour son hélico au centre, offrant un point de conflit stratégique."
},
{
    id: 93,
    question: "Quelle carte se situe dans une station nucléaire désertique ?",
    answers: ["Firing Range", "Meltdown", "Crossfire", "Summit"],
    correct: 1,
    category: "cartes",
    difficulty: "medium",
    explanation: "Meltdown représente un site nucléaire abandonné, avec des zones dangereuses et ouvertes."
},
{
    id: 94,
    question: "Quelle carte est connue pour ses couloirs étroits et son combat rapproché constant ?",
    answers: ["Nuketown", "Shipment", "Firing Range", "Terminal"],
    correct: 1,
    category: "cartes",
    difficulty: "easy",
    explanation: "Shipment est minuscule et très dynamique, avec peu d’endroits pour se cacher."
},
{
    id: 95,
    question: "Quelle carte se déroule dans un terminal d’aéroport ?",
    answers: ["Terminal", "Takeoff", "Highrise", "Standoff"],
    correct: 0,
    category: "cartes",
    difficulty: "easy",
    explanation: "Terminal prend place dans un aéroport civil, avec un avion accessible à l’intérieur."
},
{
    id: 96,
    question: "La carte 'Raid' est basée dans :",
    answers: ["Un bâtiment gouvernemental", "Une villa de luxe à Hollywood", "Une base militaire", "Un centre commercial"],
    correct: 1,
    category: "cartes",
    difficulty: "medium",
    explanation: "Raid se déroule dans une villa moderne avec piscine, inspirée d’Hollywood Hills."
},
{
    id: 97,
    question: "Quelle carte se trouve dans un environnement enneigé ?",
    answers: ["Summit", "Crossfire", "Firing Range", "Hijacked"],
    correct: 0,
    category: "cartes",
    difficulty: "easy",
    explanation: "Summit est une carte enneigée avec un complexe industriel en altitude."
},
{
    id: 98,
    question: "Standoff est située dans :",
    answers: ["Une ville afghane", "Un village mexicain", "Une rue américaine", "Une petite ville asiatique"],
    correct: 3,
    category: "cartes",
    difficulty: "medium",
    explanation: "Standoff se déroule dans un village asiatique au style rural, bien connu pour ses zones ouvertes et ses angles serrés."
},
{
    id: 99,
    question: "La carte 'Takeoff' est connue pour :",
    answers: ["Son décor d’île tropicale", "Son train mobile", "Ses lance-roquettes", "Ses hangars militaires"],
    correct: 0,
    category: "cartes",
    difficulty: "hard",
    explanation: "Takeoff est inspirée d'une base spatiale sur une île tropicale, avec des structures uniques."
},
{
    id: 100,
    question: "Quelle carte se situe dans une université ou un campus moderne ?",
    answers: ["Hacienda", "Slums", "Scrapyard", "University"],
    correct: 3,
    category: "cartes",
    difficulty: "hard",
    explanation: "University est une carte introduite dans CODM qui se déroule sur un campus avec des couloirs et salles de classe."
},
{
    id: 101,
    question: "Firing Range est basée sur :",
    answers: ["Un champ d'entraînement militaire", "Une ville abandonnée", "Une base navale", "Une station scientifique"],
    correct: 0,
    category: "cartes",
    difficulty: "easy",
    explanation: "Firing Range est un champ de tir militaire classique, avec des cabanes et des zones ouvertes."
},
{
    id: 102,
    question: "Quelle carte est intégrée dans la zone de Battle Royale Isolated ?",
    answers: ["Crash", "Hijacked", "Nuketown", "Toutes"],
    correct: 3,
    category: "cartes",
    difficulty: "medium",
    explanation: "Plusieurs cartes multijoueur sont aussi intégrées dans Isolated, la map BR principale."
},
{
    id: 103,
    question: "Quelle carte a un train qui traverse les lignes de combat ?",
    answers: ["Express", "Takeoff", "Summit", "Highrise"],
    correct: 0,
    category: "cartes",
    difficulty: "hard",
    explanation: "Express est une carte urbaine avec un train rapide qui peut tuer les joueurs s’ils ne font pas attention."
},
{
    id: 104,
    question: "La carte 'Slums' est connue pour :",
    answers: ["Son décor futuriste", "Son temple central", "Son ambiance urbaine délabrée", "Son style western"],
    correct: 2,
    category: "cartes",
    difficulty: "medium",
    explanation: "Slums se déroule dans une ville délabrée typique, avec ruelles et petits immeubles."
},
{
    id: 105,
    question: "Quelle carte a été ajoutée dans CODM avec un événement zombie ?",
    answers: ["Shi No Numa", "Meltdown", "Terminal", "Takeoff"],
    correct: 0,
    category: "cartes",
    difficulty: "medium",
    explanation: "Shi No Numa est une carte zombie iconique, adaptée dans CODM pour des événements PvE."
}

]


// ===== FONCTIONS DE GESTION DES QUESTIONS =====

/**
 * Sélectionne aléatoirement des questions pour un quiz
 * @param {number} count - Nombre de questions à sélectionner
 * @returns {Array} Tableau des questions sélectionnées
 */
function getRandomQuestions(count = QUIZ_CONFIG.questionsPerQuiz) {
    const availableQuestions = [...CODM_QUESTIONS];
    const selectedQuestions = [];
    
    // Vérifier qu'on a assez de questions
    const maxQuestions = Math.min(count, availableQuestions.length);
    
    for (let i = 0; i < maxQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions.splice(randomIndex, 1)[0];
        
        // Mélanger les réponses si configuré
        if (QUIZ_CONFIG.shuffleAnswers) {
            question = shuffleAnswers(question);
        }
        
        selectedQuestions.push(question);
    }
    
    return selectedQuestions;
}

/**
 * Mélange les réponses d'une question
 * @param {Object} question - Question à traiter
 * @returns {Object} Question avec réponses mélangées
 */
function shuffleAnswers(question) {
    const shuffledQuestion = { ...question };
    const correctAnswer = question.answers[question.correct];
    
    // Mélanger le tableau des réponses
    const shuffledAnswers = [...question.answers];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    
    // Trouver le nouvel index de la bonne réponse
    shuffledQuestion.answers = shuffledAnswers;
    shuffledQuestion.correct = shuffledAnswers.indexOf(correctAnswer);
    
    return shuffledQuestion;
}

/**
 * Obtient une question par son ID
 * @param {number} questionId - ID de la question
 * @returns {Object|null} Question trouvée ou null
 */
function getQuestionById(questionId) {
    return CODM_QUESTIONS.find(q => q.id === questionId) || null;
}

/**
 * Filtre les questions par catégorie
 * @param {string} category - Catégorie recherchée
 * @returns {Array} Questions de la catégorie
 */
function getQuestionsByCategory(category) {
    return CODM_QUESTIONS.filter(q => q.category === category);
}

/**
 * Filtre les questions par difficulté
 * @param {string} difficulty - Difficulté recherchée ('easy', 'medium', 'hard')
 * @returns {Array} Questions de la difficulté
 */
function getQuestionsByDifficulty(difficulty) {
    return CODM_QUESTIONS.filter(q => q.difficulty === difficulty);
}

/**
 * Obtient les statistiques des questions
 * @returns {Object} Statistiques complètes
 */
function getQuestionsStats() {
    const stats = {
        total: CODM_QUESTIONS.length,
        byCategory: {},
        byDifficulty: {
            easy: 0,
            medium: 0,
            hard: 0
        }
    };
    
    // Compter par catégorie
    CODM_QUESTIONS.forEach(question => {
        // Catégories
        if (!stats.byCategory[question.category]) {
            stats.byCategory[question.category] = 0;
        }
        stats.byCategory[question.category]++;
        
        // Difficultés
        if (stats.byDifficulty[question.difficulty] !== undefined) {
            stats.byDifficulty[question.difficulty]++;
        }
    });
    
    return stats;
}

/**
 * Valide le format d'une question
 * @param {Object} question - Question à valider
 * @returns {boolean} True si la question est valide
 */
function validateQuestion(question) {
    const required = ['id', 'question', 'answers', 'correct', 'category'];
    
    // Vérifier les champs obligatoires
    for (const field of required) {
        if (!question.hasOwnProperty(field)) {
            console.error(`Champ manquant: ${field}`);
            return false;
        }
    }
    
    // Vérifier le format des réponses
    if (!Array.isArray(question.answers) || question.answers.length < 2) {
        console.error('Au moins 2 réponses requises');
        return false;
    }
    
    // Vérifier l'index de la bonne réponse
    if (question.correct < 0 || question.correct >= question.answers.length) {
        console.error('Index de réponse correcte invalide');
        return false;
    }
    
    return true;
}

/**
 * Ajoute une nouvelle question (pour extension future)
 * @param {Object} question - Nouvelle question
 * @returns {boolean} Succès de l'ajout
 */
function addQuestion(question) {
    if (!validateQuestion(question)) {
        return false;
    }
    
    // Vérifier que l'ID n'existe pas déjà
    if (getQuestionById(question.id)) {
        console.error(`Question avec ID ${question.id} existe déjà`);
        return false;
    }
    
    CODM_QUESTIONS.push(question);
    console.log(`Question ${question.id} ajoutée avec succès`);
    return true;
}

/**
 * Génère un quiz complet avec métadonnées
 * @param {Object} options - Options de génération
 * @returns {Object} Quiz complet
 */
function generateQuiz(options = {}) {
    const defaultOptions = {
        questionsCount: QUIZ_CONFIG.questionsPerQuiz,
        category: null,
        difficulty: null,
        includeExplanations: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    let availableQuestions = [...CODM_QUESTIONS];
    
    // Filtrer par catégorie si spécifiée
    if (finalOptions.category) {
        availableQuestions = availableQuestions.filter(q => q.category === finalOptions.category);
    }
    
    // Filtrer par difficulté si spécifiée
    if (finalOptions.difficulty) {
        availableQuestions = availableQuestions.filter(q => q.difficulty === finalOptions.difficulty);
    }
    
    // Sélectionner les questions
    const selectedQuestions = getRandomElements(availableQuestions, finalOptions.questionsCount);
    
    // Mélanger les réponses
    const processedQuestions = selectedQuestions.map(q => 
        QUIZ_CONFIG.shuffleAnswers ? shuffleAnswers(q) : q
    );
    
    return {
        id: Date.now(),
        questions: processedQuestions,
        metadata: {
            totalQuestions: processedQuestions.length,
            category: finalOptions.category || 'mixed',
            difficulty: finalOptions.difficulty || 'mixed',
            createdAt: new Date().toISOString(),
            estimatedDuration: processedQuestions.length * 30 // 30 secondes par question
        }
    };
}

// ===== UTILITAIRES HELPER =====

/**
 * Sélectionne des éléments aléatoires d'un tableau
 * @param {Array} array - Tableau source
 * @param {number} count - Nombre d'éléments
 * @returns {Array} Éléments sélectionnés
 */
function getRandomElements(array, count) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, array.length));
}

// ===== EXPORT DES FONCTIONS =====

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CODM_QUESTIONS,
        QUIZ_CONFIG,
        getRandomQuestions,
        shuffleAnswers,
        getQuestionById,
        getQuestionsByCategory,
        getQuestionsByDifficulty,
        getQuestionsStats,
        validateQuestion,
        addQuestion,
        generateQuiz
    };
}

// ===== EXPOSITION GLOBALE =====

// Rendre disponible globalement
window.QuizQuestions = {
    generateQuiz,
    getRandomQuestions,
    getQuestionById,
    getQuestionsByCategory,
    getQuestionsByDifficulty,
    getQuestionsStats,
    validateQuestion,
    addQuestion,
};

// ===== INITIALISATION =====

// Valider toutes les questions au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Validation des questions CODM...');
    
    let validQuestions = 0;
    let invalidQuestions = 0;
    
    CODM_QUESTIONS.forEach(question => {
        if (validateQuestion(question)) {
            validQuestions++;
        } else {
            invalidQuestions++;
            console.error(`Question invalide:`, question);
        }
    });
    
    console.log(`✅ ${validQuestions} questions valides`);
    if (invalidQuestions > 0) {
        console.warn(`⚠️ ${invalidQuestions} questions invalides détectées`);
    }
    
    // Afficher les statistiques
    const stats = getQuestionsStats();
    console.log('📊 Statistiques questions:', stats);
});

console.log('🎮 Quiz CODM - Questions chargées (15 questions disponibles)');
