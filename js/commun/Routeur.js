import { ROUTE_ACCUEIL } from './constantes.js';

export default class Routeur {
  constructor(elementConteneur) {
    this._elementConteneur = elementConteneur;
    this._routes = new Map();
    this._routeCourante = null;
    this._ecouteurHashChange = this._surHashChange.bind(this);
  }

  enregistrerRoute(chemin, callbackAfficher, callbackMasquer = null) {
    this._routes.set(chemin, { callbackAfficher, callbackMasquer });
  }

  naviguerVers(chemin) {
    window.location.hash = chemin;
  }

  obtenirRouteCourante() {
    return window.location.hash.slice(1) || ROUTE_ACCUEIL;
  }

  demarrer() {
    window.addEventListener('hashchange', this._ecouteurHashChange);
    this._afficherRoute(this.obtenirRouteCourante());
  }

  arreter() {
    window.removeEventListener('hashchange', this._ecouteurHashChange);
  }

  _surHashChange() {
    this._afficherRoute(this.obtenirRouteCourante());
  }

  _afficherRoute(chemin) {
    if (!this._routes.has(chemin)) {
      this.naviguerVers(ROUTE_ACCUEIL);
      return;
    }

    if (this._routeCourante && this._routes.has(this._routeCourante)) {
      const { callbackMasquer } = this._routes.get(this._routeCourante);
      if (callbackMasquer) callbackMasquer();
    }

    this._routeCourante = chemin;
    this._routes.get(chemin).callbackAfficher();
  }
}
