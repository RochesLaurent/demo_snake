export default class GestionnaireVues {
  constructor(elementConteneur) {
    this._elementConteneur = elementConteneur;
    this._vues = new Map();
    this._vueCourante = null;
  }

  enregistrerVue(chemin, factory) {
    this._vues.set(chemin, factory);
  }

  afficherVue(chemin) {
    if (!this._vues.has(chemin)) return;

    if (this._vueCourante) {
      this._vueCourante.instance.detruire();
      this._vueCourante = null;
    }

    const instance = this._vues.get(chemin)();
    instance.afficher();
    this._vueCourante = { chemin, instance };
  }

  masquerVueCourante() {
    if (this._vueCourante) {
      this._vueCourante.instance.masquer();
    }
  }
}
