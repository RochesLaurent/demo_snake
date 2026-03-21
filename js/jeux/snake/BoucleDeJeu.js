export class BoucleDeJeu {
  constructor(callbackTick) {
    this._callbackTick = callbackTick;
    this._intervalId = null;
  }

  get enCours() {
    return this._intervalId !== null;
  }

  demarrer(vitesse) {
    if (this.enCours) return;
    this._intervalId = setInterval(this._callbackTick, vitesse);
  }

  arreter() {
    if (!this.enCours) return;
    clearInterval(this._intervalId);
    this._intervalId = null;
  }

  changerVitesse(nouvelleVitesse) {
    this.arreter();
    this.demarrer(nouvelleVitesse);
  }
}
