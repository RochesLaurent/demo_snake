import InterfaceJeu from '../../commun/InterfaceJeu.js';
import { ETATS_JEU } from '../../commun/constantes.js';
import SelecteurProfil from '../../commun/SelecteurProfil.js';
import Jeu from './Jeu.js';
import SnakeUI from './ui/SnakeUI.js';

export default class JeuSnake extends InterfaceJeu {
  static ID          = 'snake';
  static NOM         = 'Snake';
  static DESCRIPTION = 'Guidez le serpent, mangez et grandissez sans toucher les murs ni votre propre corps.';
  static ICONE       = '<img src="images/snake/snakeIcon.png" alt="Snake" class="carte-jeu__icone-img" />';
  static UTILISE_SCORES = true;

  constructor(elementConteneur, options = {}) {
    super(elementConteneur, options);
    this._jeu                 = null;
    this._ui                  = null;
    this._wrapper             = null;
    this._gestionnaireProfils = null;
    this._depotScores         = null;
    this._selecteur           = null;
  }

  initialiser() {
    this._gestionnaireProfils = this._options.gestionnaireProfils ?? null;
    this._depotScores         = this._options.depotScores         ?? null;

    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('jeu-snake');
    this._elementConteneur.appendChild(this._wrapper);

    this._jeu = new Jeu(this._wrapper, {
      surFinDePartie: (score, niveau) => {
        this._changerEtat(ETATS_JEU.TERMINE);
        if (this._ui) this._ui.afficherFinDePartie(score, niveau);
        if (this.surFinDePartie) this.surFinDePartie(score, niveau);
      },
      surScoreChange: (score, niveau) => {
        if (this._ui) this._ui.mettreAJourScore(score, niveau);
        if (this.surScoreChange) this.surScoreChange(score, niveau);
      },
    });

    this._ui = new SnakeUI(this._wrapper, this._jeu, {
      depotScores:         this._depotScores,
      gestionnaireProfils: this._gestionnaireProfils,
      surRetourMenu: () => { window.location.hash = '#accueil'; },
      surRejouer: () => {
        this._changerEtat(ETATS_JEU.EN_COURS);
        this._jeu.demarrer();
      },
    });
  }

  demarrer() {
    this._selecteur = new SelecteurProfil(this._wrapper, this._gestionnaireProfils, {
      titreBouton: 'Jouer',
      onSelect: (profil) => {
        this._selecteur.detruire();
        this._selecteur = null;
        this._changerEtat(ETATS_JEU.EN_COURS);
        this._ui.definirProfil(profil);
        this._ui.afficher();
      },
      onFermer: () => {
        this._selecteur = null;
        window.location.hash = '#accueil';
      },
    });
    this._selecteur.afficher();
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
    if (this._ui) this._ui.masquer();
  }

  detruire() {
    if (this._selecteur) {
      this._selecteur.detruire();
      this._selecteur = null;
    }
    if (this._ui) {
      this._ui.masquer();
      this._ui = null;
    }
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
