'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ = require('underscore');

// Ignoré une fois dans TERM
var TERM = ['horoscope', 'recherche', 'cherche', 'pour', 'la', 'qu\'est-ce', 'le', 'les', 'des', 'de', 'du', 'sur', 'ce', 'que', 'qui', 'signe', 'c\'est', 'est', 'sur', 's\'il', 'te', 'plaît', 'plait'];
// Toujours ignoré dans NOTERM
var NOTERM = ['horoscope', 'la', 'du', 'des', 'le', 'les','ce', 'que', 'qu\'est-ce', 'qui', 'signe', 'savoir', 'pour', 'c\'est', 'est', 's\'il', 'te', 'plaît', 'plait'];
// Non ignoré si un term est déjà pris, ex: la défintion de la revue du cinéma
var IGNORETERM = [];


exports.default = function (state) {

    return new Promise(function (resolve, reject) {
    var TAKEN = [];
    for (var i in TERM) {
    TAKEN.push(0);
}

    var sentence = '';
    var indexHoroscope, pos, take;
    var terms = state.rawSentence.split(' ');
    terms.map(function (term, index) {
    if (!indexHoroscope && (term.toLowerCase() === 'horoscope' || (term.toLowerCase() === 'l\'horoscope'))) indexHoroscope = true;
    if (indexHoroscope) {
    take = false;
    pos = _.indexOf(TERM, term.toLowerCase());
    if (pos != -1) {
    if (TAKEN[pos] == 0) {
    if (sentence && sentence.length > 0 && _.indexOf(IGNORETERM, term.toLowerCase()) != -1) {
    take = true;
} 
    else {
    TAKEN[pos] = 1;
}
} 
    else {
    if (_.indexOf(NOTERM, term.toLowerCase()) == -1)
    take = true;
}
} 
    else {
    take = true;
}
    if (take) {
    sentence += term;
    if (terms[index + 1]) sentence += ' ';
}
}
    });

    // test si on a récupéré quelque chose
    if (sentence) {
    sentence = sentence.replace('l\'horoscope ', '');
    sentence = sentence.sansAccent();
    sentence = sentence.replace(sentence[0], sentence[0].toUpperCase()
);

    switch (sentence) {
    case 'Poisson': sentence = 'poissons'; break;
    case 'Gemeauxs': sentence = 'gemeaux'; break;
    case 'Vierges': sentence = 'vierge'; break;
    case 'Capricornes': sentence = 'capricorne'; break;
    case 'Beliers': sentence = 'belier'; break;
     case 'Sagittaires': sentence = 'sagittaire'; break;
    case 'Lions': sentence = 'lion'; break;
    case 'Scorpions': sentence = 'scorpion'; break;
    case 'Balances': sentence = 'balance'; break;
     case 'Cancers': sentence = 'cancer'; break;
    case 'Verseaux': sentence = 'verseau'; break;
    case 'Taureaux': sentence = 'taureau'; break;
    default: sentence = sentence;
}

    // Affiche le signe qui doit être recherché
    if (state.debug) info('ActionHoroscope'.bold.yellow, 'sentence:'.bold, sentence);
    // Envoi au plugin
    setTimeout(function () {
    state.action = {
    module: 'horoscope',
    command:'recherche',
    sentence: sentence
    };
    resolve(state);
}, 500);

} 
    else {
    setTimeout(function () {
 // Envoi au plugin l'erreur
    state.action = {
    module: 'horoscope',
    command: 'error',
    error: 'je suis désolé, je n\'ai pas compris le signe zodiaque recherché'
};
    resolve(state);
}, 500);
}
    });
};

String.prototype.sansAccent = function () {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    var str = this;
    for (var i = 0; i < accent.length; i++) {
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}