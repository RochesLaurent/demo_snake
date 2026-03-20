import Score from './Score.js';

const CLE_SCORES = 'scores';

export default class DepotScores {
  constructor(depotLocal) {
    this._depot = depotLocal;
  }

  listerTous() {
    return (this._depot.lire(CLE_SCORES) ?? []).map(donnees => new Score(donnees));
  }

  listerParJeu(jeuId) {
    return this.listerTous().filter(s => s.jeuId === jeuId);
  }

  listerParProfil(profilId) {
    return this.listerTous().filter(s => s.profilId === profilId);
  }

  listerParJeuEtProfil(jeuId, profilId) {
    return this.listerTous().filter(s => s.jeuId === jeuId && s.profilId === profilId);
  }

  enregistrer(score) {
    const scores = this.listerTous();
    scores.push(score);
    this._depot.ecrire(CLE_SCORES, scores);
  }

  vider() {
    this._depot.supprimer(CLE_SCORES);
  }
}
