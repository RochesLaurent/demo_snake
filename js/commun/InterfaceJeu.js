import { ETATS_JEU } from './constantes.js';

export default class InterfaceJeu {
  static ID = '';
  static NOM = '';
  static DESCRIPTION = '';
  static ICONE = '';
  static UTILISE_SCORES = true;

  constructor(elementConteneur, options = {}) {
    this._elementConteneur = elementConteneur;
    this._options = options;
    this._etat = ETATS_JEU.PRET;

    this.surFinDePartie = null;
    this.surScoreChange = null;
    this.surChangementEtat = null;
  }

  get etat() {
    return this._etat;
  }

  get scoreActuel() {
    return null;
  }

  _changerEtat(nouvelEtat) {
    this._etat = nouvelEtat;
    if (this.surChangementEtat) {
      this.surChangementEtat(nouvelEtat);
    }
  }


  initialiser() {
    throw new Error(`${this.constructor.name} doit implémenter initialiser()`);
  }

  demarrer() {
    throw new Error(`${this.constructor.name} doit implémenter demarrer()`);
  }

  mettreEnPause() {
    throw new Error(`${this.constructor.name} doit implémenter mettreEnPause()`);
  }

  reprendre() {
    throw new Error(`${this.constructor.name} doit implémenter reprendre()`);
  }

  arreter() {
    throw new Error(`${this.constructor.name} doit implémenter arreter()`);
  }

  detruire() {
    throw new Error(`${this.constructor.name} doit implémenter detruire()`);
  }
}
