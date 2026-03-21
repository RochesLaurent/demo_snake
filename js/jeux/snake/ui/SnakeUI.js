import Score from '../../../score/Score.js';
import DPad from './DPad.js';

export default class SnakeUI {
  constructor(elementConteneur, jeu, depotScores, profilActif, { surRetourMenu, surRejouer } = {}) {
    this._conteneur = elementConteneur;
    this._jeu = jeu;
    this._depotScores = depotScores ?? null;
    this._profilActif = profilActif ?? null;
    this._surRetourMenu = surRetourMenu ?? null;
    this._surRejouer = surRejouer ?? null;

    this._hud = null;
    this._elScore = null;
    this._elNiveau = null;
    this._elBtnPause = null;
    this._overlay = null;
    this._dpad = null;
    this._estEnPause = false;
  }

  afficher() {
    this._creerHUD();
    this._dpad = new DPad(this._conteneur, (dir) => this._jeu._onDirection(dir));
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
    this._estEnPause = false;
  }

  mettreAJourScore(score, niveau) {
    if (this._elScore) this._elScore.textContent = `Score : ${score}`;
    if (this._elNiveau) this._elNiveau.textContent = `Niveau : ${niveau}`;
  }

  afficherFinDePartie(score, niveau) {
    if (this._depotScores && this._profilActif) {
      this._depotScores.enregistrer(new Score({
        profilId: this._profilActif.id,
        jeuId: 'snake',
        points: score,
        niveau,
      }));
    }

    const scoresJeu = this._depotScores
      ? this._depotScores.listerParJeu('snake').sort((a, b) => b.points - a.points)
      : [];
    const meilleur = scoresJeu[0]?.points ?? score;

    this._overlay = document.createElement('div');
    this._overlay.classList.add('overlay-fin');
    this._overlay.innerHTML = `
      <h2>Game Over</h2>
      <p>Score : ${score} — Niveau : ${niveau}</p>
      <p>Meilleur score : ${meilleur}</p>
      <button class="btn--rejouer">Rejouer</button>
      <button class="btn--menu">Accueil</button>
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
      <button class="hud__pause">Pause</button>
    `;

    this._elScore = this._hud.querySelector('.hud__score');
    this._elNiveau = this._hud.querySelector('.hud__niveau');
    this._elBtnPause = this._hud.querySelector('.hud__pause');

    this._elBtnPause.addEventListener('click', () => {
      this._jeu.mettreEnPause();
      this._estEnPause = !this._estEnPause;
      this._elBtnPause.textContent = this._estEnPause ? 'Reprendre' : 'Pause';
    });

    this._conteneur.prepend(this._hud);
  }
}
