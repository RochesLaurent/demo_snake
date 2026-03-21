import Score from '../../../score/Score.js';
import DPad from './DPad.js';
import SnakeScoresUI from './SnakeScoresUI.js';

export default class SnakeUI {
  constructor(elementConteneur, jeu, options = {}) {
    this._conteneur          = elementConteneur;
    this._jeu                = jeu;
    this._depotScores        = options.depotScores        ?? null;
    this._gestionnaireProfils = options.gestionnaireProfils ?? null;
    this._surRetourMenu      = options.surRetourMenu      ?? null;
    this._surRejouer         = options.surRejouer         ?? null;

    this._profilActif  = null;
    this._scoreMax     = 0;

    this._hud          = null;
    this._elScore      = null;
    this._elNiveau     = null;
    this._elScoreMax   = null;
    this._elBtnPause   = null;
    this._overlay      = null;
    this._dpad         = null;
    this._zoneGrille   = null;
    this._estEnPause   = false;
  }

  definirProfil(profil) {
    this._profilActif = profil;
  }

  afficher() {
    if (this._profilActif && this._depotScores) {
      const historique = this._depotScores.listerParJeuEtProfil('snake', this._profilActif.id);
      this._scoreMax = historique.reduce((max, s) => Math.max(max, s.points), 0);
    } else {
      this._scoreMax = 0;
    }

    this._creerHUD();

    // Envelopper le plateau dans une zone relative pour le D-pad overlay
    const plateau = this._conteneur.querySelector('#plateau-snake');
    this._zoneGrille = document.createElement('div');
    this._zoneGrille.classList.add('zone-grille');
    plateau.parentNode.insertBefore(this._zoneGrille, plateau);
    this._zoneGrille.appendChild(plateau);

    this._dpad = new DPad(this._zoneGrille, (dir) => this._jeu._onDirection(dir));
    this._dpad.afficher();
    this._jeu.demarrer();
  }

  masquer() {
    this._jeu.arreter();
    if (this._hud) {
      this._hud.remove();
      this._hud = null;
    }
    if (this._overlay) {
      this._overlay.remove();
      this._overlay = null;
    }
    if (this._dpad) {
      this._dpad.detruire();
      this._dpad = null;
    }
    if (this._zoneGrille) {
      const plateau = this._zoneGrille.querySelector('#plateau-snake');
      if (plateau) this._zoneGrille.before(plateau);
      this._zoneGrille.remove();
      this._zoneGrille = null;
    }
    this._estEnPause = false;
  }

  mettreAJourScore(score, niveau) {
    if (this._elScore)  this._elScore.textContent  = `Score : ${score}`;
    if (this._elNiveau) this._elNiveau.textContent = `Niveau : ${niveau}`;
  }

  afficherFinDePartie(score, niveau) {
    if (this._depotScores && this._profilActif) {
      this._depotScores.enregistrer(new Score({
        profilId: this._profilActif.id,
        jeuId:    'snake',
        points:   score,
        niveau,
      }));
    }

    const estNouveauRecord = score > this._scoreMax;
    if (estNouveauRecord) {
      this._scoreMax = score;
      if (this._elScoreMax) this._elScoreMax.textContent = `TopScore : ${this._scoreMax}`;
    }

    const scoresJeu = this._depotScores
      ? this._depotScores.listerParJeuEtProfil('snake', this._profilActif?.id ?? '')
          .sort((a, b) => b.points - a.points)
      : [];
    const meilleur = scoresJeu[0]?.points ?? score;

    this._overlay = document.createElement('div');
    this._overlay.classList.add('overlay-fin');
    this._overlay.innerHTML = `
      <h2>Game Over</h2>
      <p>Score : ${score} — Niveau : ${niveau}</p>
      <p>Meilleur score : ${meilleur}</p>
      ${estNouveauRecord ? '<p class="overlay-fin__record">🎉 Nouveau record !</p>' : ''}
      <div class="overlay-fin__boutons">
        <button class="btn btn--primaire btn--rejouer">Rejouer</button>
        <button class="btn btn--secondaire btn--scores-fin">
          <img src="images/classementIcon.png" alt="" class="btn-icone" /> Scores
        </button>
        <button class="btn btn--secondaire btn--menu">Accueil</button>
      </div>
    `;

    this._overlay.querySelector('.btn--rejouer').addEventListener('click', () => {
      this._overlay.remove();
      this._overlay = null;
      this._estEnPause = false;
      if (this._elBtnPause) this._elBtnPause.textContent = 'Pause';
      if (this._surRejouer) {
        this._surRejouer();
      } else {
        this._jeu.demarrer();
      }
    });

    this._overlay.querySelector('.btn--scores-fin').addEventListener('click', () => {
      this._ouvrirScores();
    });

    this._overlay.querySelector('.btn--menu').addEventListener('click', () => {
      if (this._surRetourMenu) this._surRetourMenu();
    });

    this._conteneur.appendChild(this._overlay);
  }

  _creerHUD() {
    const nomJoueur = this._profilActif?.nom ?? 'Joueur';

    this._hud = document.createElement('header');
    this._hud.classList.add('hud');
    this._hud.innerHTML = `
      <span class="hud__profil">${nomJoueur}</span>
      <span class="hud__score">Score : 0</span>
      <span class="hud__niveau">Niveau : 1</span>
      <span class="hud__score-max">TopScore : ${this._scoreMax}</span>
      <button class="hud__scores" aria-label="Classement">
        <img src="images/classementIcon.png" alt="Classement" class="hud__scores-icone" />
      </button>
      <button class="hud__pause">Pause</button>
    `;

    this._elScore    = this._hud.querySelector('.hud__score');
    this._elNiveau   = this._hud.querySelector('.hud__niveau');
    this._elScoreMax = this._hud.querySelector('.hud__score-max');
    this._elBtnPause = this._hud.querySelector('.hud__pause');

    this._elBtnPause.addEventListener('click', () => {
      this._jeu.mettreEnPause();
      this._estEnPause = !this._estEnPause;
      this._elBtnPause.textContent = this._estEnPause ? 'Reprendre' : 'Pause';
    });

    this._hud.querySelector('.hud__scores').addEventListener('click', () => {
      this._ouvrirScores();
    });

    this._conteneur.prepend(this._hud);
  }

  _ouvrirScores() {
    if (!this._depotScores || !this._gestionnaireProfils) return;

    const etaitEnPause = this._estEnPause;
    if (!etaitEnPause) {
      this._jeu.mettreEnPause();
      this._estEnPause = true;
      if (this._elBtnPause) this._elBtnPause.textContent = 'Reprendre';
    }

    const scoresUI = new SnakeScoresUI(this._conteneur, this._depotScores, this._gestionnaireProfils, {
      surRetour: () => {
        scoresUI.masquer();
        if (!etaitEnPause) {
          this._jeu.mettreEnPause(); // reprendre
          this._estEnPause = false;
          if (this._elBtnPause) this._elBtnPause.textContent = 'Pause';
        }
      },
    });
    scoresUI.afficher();
  }
}
