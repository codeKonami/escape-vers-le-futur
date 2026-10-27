// =============================================================================
// CONFIGURATION DU JEU « CHRONO·MISSION »
// Tout ce qui se règle (textes, réponses, codes, QR codes, chiffres du coffre,
// mélodie, course, prénoms, adresse du site) se trouve dans ce fichier.
// Les tests automatiques relisent ce fichier : ils restent valides si vous le modifiez.
// =============================================================================

// Adresse du site publié. Les QR codes imprimés pointent TOUJOURS vers cette
// adresse, même quand on lance l'appli sur son ordinateur.
export const productionUrl = 'https://codekonami.github.io/escape-vers-le-futur/'

// Prénoms des enfants, affichés sur les cartes à glisser sous les oreillers.
export const kids = {
  // Trouve le QR code de départ sous son oreiller.
  first: 'Alex',
  // Trouve le code à 4 chiffres sous son oreiller.
  second: 'Sam',
}

// -----------------------------------------------------------------------------
// Les étapes, dans l'ordre. Chaque étape a un « kind » qui choisit l'écran :
//   code     : clavier numérique + afficheur LCD
//   question : question avec réponse à taper
//   scan     : énigme + QR code caché à scanner
//   melody   : mélodie à rejouer au piano (voir « melody » plus bas)
//   race     : mini-jeu de la course (voir « race » plus bas)
//   treasure : écran final avec le code du coffre
// « digit » : chiffre du coffre gagné à cette étape (les chiffres sont numérotés
// dans l'ordre où ils apparaissent ; le code du coffre les assemble).
// « success » : phrase de la fenêtre « Étape réussie ! » quand l'étape ne donne
// pas de chiffre.
// -----------------------------------------------------------------------------

export type CodeStep = {
  kind: 'code'
  title: string
  intro: string
  lcdLabel: string
  code: string
  button: string
  error: string
  success: string
}

export type QuestionStep = {
  kind: 'question'
  title: string
  question: string
  // Réponses acceptées. Les majuscules, accents, espaces et la ponctuation
  // sont ignorés : « Einstein », « einstein ! » et « EINSTEIN » sont équivalents.
  answers: string[]
  error: string
  digit: string
  icon?: 'paw'
}

export type ScanStep = {
  kind: 'scan'
  title: string
  riddle: string
  // Mot caché dans le QR code (l'adresse imprimée se termine par #/scan/<token>).
  token: string
  // Carte imprimée depuis l'espace parent.
  card: { title: string; where: string }
  digit?: string
  success?: string
}

export type MelodyStep = { kind: 'melody'; title: string; intro: string; fail: string; digit: string }

export type RaceStep = {
  kind: 'race'
  title: string
  intro: string
  rules: string
  crash: string
  crashHint: string
  success: string
}

export type TreasureStep = { kind: 'treasure'; title: string; text: string; hint: string }

export type Step = CodeStep | QuestionStep | ScanStep | MelodyStep | RaceStep | TreasureStep

export const steps: Step[] = [
  {
    kind: 'code',
    title: 'Machine temporelle verrouillée',
    intro: "L'un de vous a trouvé un code secret sous son oreiller. Tapez-le pour réveiller la machine.",
    lcdLabel: 'CODE',
    code: '2610',
    button: 'Activer la machine',
    error: 'Code incorrect. Vérifiez et réessayez !',
    success: 'La machine se réveille. En route pour la première énigme !',
  },
  {
    kind: 'question',
    title: 'Énigme de la vitesse',
    question:
      'Dans le film, la voiture doit atteindre une vitesse précise pour sauter dans le temps. Laquelle, en miles par heure ?',
    answers: ['88', '88 mph', '88 miles par heure', 'quatre-vingt-huit'],
    error: 'Pas tout à fait… Réfléchissez encore !',
    digit: '3',
  },
  {
    kind: 'scan',
    title: 'Mission terrain',
    riddle: '« Mes cases sont noires et blanches, mais je ne suis pas un QR code. »',
    token: 'ROQUE',
    card: { title: 'Mission terrain', where: "Dans la boîte ou sous le plateau du jeu d'échecs" },
    digit: '9',
  },
  {
    kind: 'code',
    title: 'Le compteur temporel',
    intro: "Réglez le compteur sur l'année où Marty atterrit dans le passé, au début du film.",
    lcdLabel: 'ANNÉE',
    code: '1955',
    button: 'Régler le compteur',
    error: "Ce n'est pas la bonne année. Réessayez !",
    success: 'La machine reprend des forces. En route pour la suite !',
  },
  {
    kind: 'melody',
    title: 'La mélodie secrète',
    intro: 'Écoutez la mélodie, puis rejouez-la sur le piano. Le téléphone vous écoute !',
    fail: 'Raté ! On recommence depuis la première note.',
    digit: '1',
  },
  {
    kind: 'question',
    title: 'Le fidèle compagnon',
    question: "Le savant du film a un chien qui fait le tout premier voyage dans le temps. Comment s'appelle-t-il ?",
    answers: ['Einstein', 'Einsten', 'Einstain', 'Ainstein'],
    error: 'Pas tout à fait… Réfléchissez encore !',
    digit: '2',
    icon: 'paw',
  },
  {
    kind: 'scan',
    title: 'Dernière pièce',
    riddle: "« On m'ouvre dix fois par jour, j'ai l'hiver dans le ventre et je garde le lait au frais. »",
    token: 'GLACON',
    card: { title: 'Dernière pièce', where: 'Sur la porte ou dans le réfrigérateur' },
    success: "Plus qu'une épreuve : ramenez Marty chez lui !",
  },
  {
    kind: 'race',
    title: 'La course à 88',
    intro: "Ramenez Marty chez lui : évitez les jeeps jusqu'à 88 miles par heure !",
    rules: "Changez de voie avec les flèches. Tenez jusqu'à 88 mph sans toucher une seule jeep !",
    crash: 'Boum ! Une jeep vous a percutés.',
    crashHint: 'Il faut recommencer la course.',
    success: '88 mph ! La voiture a disparu dans les éclairs : Marty est rentré chez lui.',
  },
  {
    kind: 'treasure',
    title: 'Bravo, voyageurs du temps !',
    text: 'Vous avez réparé la machine. Voici le code du coffre au trésor.',
    hint: 'Le coffre est caché dans le sacacopo.',
  },
]

// -----------------------------------------------------------------------------
// La mélodie secrète (étape « melody »).
// Reprise à l'identique du Tone.Part d'origine : chaque événement a la forme
// { time, note, duration } en notation Tone.js ("4n" = noire, "2n" = blanche).
// Les noms de notes donnent, dans l'ordre, les hauteurs attendues au micro.
// Les positions, durées et le tempo ne servent qu'à la lecture (bouton Écouter).
// -----------------------------------------------------------------------------
export const melody = {
  bpm: 120,
  events: [
    { time: 0, note: 'G4', duration: '4n' },
    { time: '4n', note: 'B4', duration: '4n' },
    { time: '2n', note: 'C5', duration: '4n' },
    { time: '2n + 4n', note: 'Bb4', duration: '2n' }, // blanche
  ],
  // false : un sol grave ou un sol aigu valent tous les deux « sol ».
  // true  : il faut jouer la note à la bonne octave.
  octaveMatters: false,
}

// -----------------------------------------------------------------------------
// La course à 88 (étape « race »).
// -----------------------------------------------------------------------------
export const race = {
  durationMs: 15000, // durée pour passer de 00 à 88 mph
  targetMph: 88,
  speedStart: 0.24, // vitesse de défilement de la route au départ (px/ms)
  speedEnd: 0.46, // … et à l'arrivée
  spawnStartMs: 900, // intervalle d'apparition des jeeps au départ
  spawnEndMs: 570, // … et à la fin
  firstSpawnMs: 700, // délai avant la première jeep
  noSpawnLastMs: 1500, // plus aucune jeep pendant la dernière seconde et demie
}

// -----------------------------------------------------------------------------
// Messages communs.
// -----------------------------------------------------------------------------
export const messages = {
  digitWon: 'Vous avez gagné le chiffre secret n°{n} du coffre :',
  digitKeep: 'Notez-le bien, vous en aurez besoin à la fin.',
  digitLast: "C'est le dernier ! Encore un effort pour trouver le coffre.",
  qrTooEarly: "Bien vu ! Mais ce QR code n'est pas encore actif : résolvez d'abord l'énigme en cours.",
  qrAlreadyUsed: 'Déjà trouvé ! Ce QR code a déjà servi.',
  scanHelp: "Trouvez l'objet dans la maison et scannez le QR code caché avec l'appareil photo du téléphone.",
  cameraDenied:
    "La caméra est bloquée. Dans Chrome, touchez l'icône à gauche de l'adresse du site, puis « Autorisations », et activez la caméra. Rechargez ensuite la page. En attendant, l'appareil photo du téléphone peut aussi lire le QR code.",
  micDenied:
    "Le micro est bloqué. Dans Chrome, touchez l'icône à gauche de l'adresse du site, puis « Autorisations », et activez le micro. Rechargez ensuite la page.",
}
