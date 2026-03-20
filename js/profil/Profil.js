import { LONGUEUR_MAX_NOM_PROFIL } from '../commun/constantes.js';

export default class Profil {
  constructor({ id = null, nom, dateCreation = new Date().toISOString() } = {}) {
    this.id = id ?? `profil_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.nom = String(nom).slice(0, LONGUEUR_MAX_NOM_PROFIL);
    this.dateCreation = dateCreation;
  }
}
