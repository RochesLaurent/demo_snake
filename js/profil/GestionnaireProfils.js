import Profil from './Profil.js';

const CLE_PROFILS = 'profils';

export default class GestionnaireProfils {
  constructor(depotLocal) {
    this._depot = depotLocal;
  }

  listerTous() {
    return (this._depot.lire(CLE_PROFILS) ?? []).map(donnees => new Profil(donnees));
  }

  ajouter(nom) {
    const profils = this.listerTous();
    const profil = new Profil({ nom });
    profils.push(profil);
    this._depot.ecrire(CLE_PROFILS, profils);
    return profil;
  }

  supprimer(id) {
    const profils = this.listerTous().filter(p => p.id !== id);
    this._depot.ecrire(CLE_PROFILS, profils);
  }

  obtenirParId(id) {
    return this.listerTous().find(p => p.id === id) ?? null;
  }
}
