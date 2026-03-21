import Plateau from './Plateau.js';
import Serpent from './Serpent.js';
import { Nourriture } from './Nourriture.js';
import { BoucleDeJeu } from './BoucleDeJeu.js';
import { DetecteurDeCollision } from './DetecteurDeCollision.js';
import {
  VITESSE_INITIALE,
  ACCELERATION_PAR_NIVEAU,
  VITESSE_MINIMALE,
  POINTS_PAR_NOURRITURE,
  NOURRITURE_PAR_NIVEAU,
  TOUCHES,
} from './constantesSnake.js';

export default class Jeu {
  constructor(elementConteneur, { surFinDePartie, surScoreChange } = {}) {
    this._surFinDePartie = surFinDePartie ?? null;
    this._surScoreChange = surScoreChange ?? null;

    this._serpent = new Serpent();
    this._nourriture = new Nourriture();
    this._plateau = new Plateau(elementConteneur);
    this._boucle = new BoucleDeJeu(() => this._tick());

    this.score = 0;
    this.niveau = 1;
    this._nourrituresMangees = 0;

    this._onKeyDown = (e) => {
      const dir = TOUCHES[e.key];
      if (dir) {
        e.preventDefault();
        this._onDirection(dir);
      }
    };
  }

  demarrer() {
    this._serpent.reinitialiser();
    this.score = 0;
    this.niveau = 1;
    this._nourrituresMangees = 0;

    this._nourriture.replacer(this._serpent.corps);
    this._plateau.mettreAJour(this._serpent, this._nourriture);

    // removeEventListener avant add pour éviter les doublons (rejouer)
    document.removeEventListener('keydown', this._onKeyDown);
    document.addEventListener('keydown', this._onKeyDown);

    this._boucle.changerVitesse(this._calculerVitesse());
  }

  mettreEnPause() {
    if (this._boucle.enCours) {
      this._boucle.arreter();
    } else {
      this._boucle.demarrer(this._calculerVitesse());
    }
  }

  arreter() {
    this._boucle.arreter();
    document.removeEventListener('keydown', this._onKeyDown);
  }

  _onDirection(dir) {
    this._serpent.demanderDirection(dir);
  }

  _tick() {
    this._serpent.avancer();

    if (DetecteurDeCollision.avecMur(this._serpent.tete)) {
      this._terminerPartie();
      return;
    }

    if (DetecteurDeCollision.avecCorps(this._serpent.tete, this._serpent.corps)) {
      this._terminerPartie();
      return;
    }

    if (DetecteurDeCollision.avecNourriture(this._serpent.tete, this._nourriture.position)) {
      this._serpent.manger();
      this.score += POINTS_PAR_NOURRITURE;
      this._nourrituresMangees++;
      this._nourriture.replacer(this._serpent.corps);

      const nouveauNiveau = 1 + Math.floor(this._nourrituresMangees / NOURRITURE_PAR_NIVEAU);
      if (nouveauNiveau > this.niveau) {
        this.niveau = nouveauNiveau;
        this._boucle.changerVitesse(this._calculerVitesse());
      }

      if (this._surScoreChange) this._surScoreChange(this.score, this.niveau);
    }

    this._plateau.mettreAJour(this._serpent, this._nourriture);
  }

  _terminerPartie() {
    this.arreter();
    this._plateau.effacer();
    if (this._surFinDePartie) this._surFinDePartie(this.score, this.niveau);
  }

  _calculerVitesse() {
    return Math.max(
      VITESSE_MINIMALE,
      VITESSE_INITIALE - (this.niveau - 1) * ACCELERATION_PAR_NIVEAU
    );
  }
}
