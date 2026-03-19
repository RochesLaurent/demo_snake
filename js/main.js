import Plateau from './jeu/Plateau.js';

console.log('app démarrée');

const plateau = new Plateau(document.getElementById('app'));
console.log('Plateau créé — cellules ligne 0 :', plateau.cellules[0].length);
