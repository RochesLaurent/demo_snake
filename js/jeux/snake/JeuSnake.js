import InterfaceJeu from '../../commun/InterfaceJeu.js';
import { ETATS_JEU } from '../../commun/constantes.js';
import Jeu from './Jeu.js';

export default class JeuSnake extends InterfaceJeu {
  static ID = 'snake';
  static NOM = 'Snake';
  static DESCRIPTION = 'Guidez le serpent, mangez et grandissez sans toucher les murs ni votre propre corps.';
  static ICONE = '🐍';
  static UTILISE_SCORES = true;

  constructor(elementConteneur, options = {}) {
    super(elementConteneur, options);
    this._jeu = null;
    this._wrapper = null;
  }

  initialiser() {
    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('jeu-snake');
    this._elementConteneur.appendChild(this._wrapper);

    this._jeu = new Jeu(this._wrapper, {
      surFinDePartie: (score, niveau) => {
        this._changerEtat(ETATS_JEU.TERMINE);
        if (this.surFinDePartie) this.surFinDePartie(score, niveau);
      },
      surScoreChange: (score, niveau) => {
        if (this.surScoreChange) this.surScoreChange(score, niveau);
      },
    });
  }

  demarrer() {
    this._changerEtat(ETATS_JEU.EN_COURS);
    this._jeu.demarrer();
  }

  mettreEnPause() {
    this._changerEtat(ETATS_JEU.EN_PAUSE);
    this._jeu.mettreEnPause();
  }

  reprendre() {
    this._changerEtat(ETATS_JEU.EN_COURS);
    this._jeu.mettreEnPause();
  }

  arreter() {
    this._changerEtat(ETATS_JEU.PRET);
    this._jeu.arreter();
  }

  detruire() {
    if (this._jeu) {
      this._jeu.arreter();
      this._jeu = null;
    }
    if (this._wrapper) {
      this._wrapper.remove();
      this._wrapper = null;
    }
  }

  get scoreActuel() {
    if (!this._jeu) return null;
    return { points: this._jeu.score, niveau: this._jeu.niveau, jeuId: JeuSnake.ID };
  }
}
