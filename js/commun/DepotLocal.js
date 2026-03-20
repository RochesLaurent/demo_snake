import { PREFIXE_STOCKAGE } from './constantes.js';

export default class DepotLocal {
  constructor(espaceDeNom) {
    this._espaceDeNom = espaceDeNom;
  }

  lire(cle) {
    const valeur = localStorage.getItem(`${this._espaceDeNom}_${cle}`);
    return valeur !== null ? JSON.parse(valeur) : null;
  }

  ecrire(cle, valeur) {
    localStorage.setItem(`${this._espaceDeNom}_${cle}`, JSON.stringify(valeur));
  }

  supprimer(cle) {
    localStorage.removeItem(`${this._espaceDeNom}_${cle}`);
  }

  listerCles() {
    const prefixe = `${this._espaceDeNom}_`;
    return Object.keys(localStorage)
      .filter(cle => cle.startsWith(prefixe))
      .map(cle => cle.slice(prefixe.length));
  }

  vider() {
    const prefixe = `${this._espaceDeNom}_`;
    Object.keys(localStorage)
      .filter(cle => cle.startsWith(prefixe))
      .forEach(cle => localStorage.removeItem(cle));
  }

  static creerPourJeu(jeuId) {
    return new DepotLocal(`${PREFIXE_STOCKAGE}_${jeuId}`);
  }

  static creerGlobal() {
    return new DepotLocal(`${PREFIXE_STOCKAGE}_global`);
  }
}
