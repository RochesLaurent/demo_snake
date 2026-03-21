import { COLONNES, LIGNES, DIRECTIONS } from './constantesSnake.js';

export default class Serpent {
  constructor() {
    this.reinitialiser();
  }

  reinitialiser() {
    const colCentre = Math.floor(COLONNES / 2);
    const ligCentre = Math.floor(LIGNES / 2);

    this.segments = [
      { col: colCentre,     lig: ligCentre },
      { col: colCentre - 1, lig: ligCentre },
      { col: colCentre - 2, lig: ligCentre },
    ];

    this.direction          = 'DROITE';
    this.directionEnAttente = 'DROITE';
    this.doitCroitre        = false;
  }

  demanderDirection(nouvDir) {
    if (!DIRECTIONS[nouvDir]) return;
    if (DIRECTIONS[this.direction].opposee === nouvDir) return;
    this.directionEnAttente = nouvDir;
  }

  avancer() {
    this.direction = this.directionEnAttente;

    const { dc, dl } = DIRECTIONS[this.direction];
    const teteActuelle = this.segments[0];
    const nouvelleTete = {
      col: teteActuelle.col + dc,
      lig: teteActuelle.lig + dl,
    };

    this.segments.unshift(nouvelleTete);

    if (this.doitCroitre) {
      this.doitCroitre = false;
    } else {
      this.segments.pop();
    }
  }

  manger() {
    this.doitCroitre = true;
  }

  get tete() {
    return this.segments[0];
  }

  get corps() {
    return [...this.segments];
  }

  get longueur() {
    return this.segments.length;
  }

  occupePosition(col, lig) {
    return this.segments.some(seg => seg.col === col && seg.lig === lig);
  }
}
