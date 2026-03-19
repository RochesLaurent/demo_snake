import {
  COLONNES, 
  LIGNES,
  CSS_CELLULE, 
  CSS_CELLULE_SERPENT, 
  CSS_CELLULE_TETE, 
  CSS_CELLULE_NOURR
} from '../constantes.js';

export default class Plateau {
  constructor(elementParent) {
    this.cellules = [];
    const conteneur = document.createElement('div');
    conteneur.id = 'plateau';

    for (let lig = 0; lig < LIGNES; lig++) {
      this.cellules[lig] = [];
      for (let col = 0; col < COLONNES; col++) {
        const cellule = document.createElement('div');
        cellule.classList.add(CSS_CELLULE);
        conteneur.appendChild(cellule);
        this.cellules[lig][col] = cellule;
      }
    }

    elementParent.appendChild(conteneur);
  }

  mettreAJour(serpent, nourriture) {
    this.effacer();

    const tete = serpent.tete;
    const corps = serpent.corps;

    for (const segment of corps) {
      this.cellules[segment.lig][segment.col].classList.add(CSS_CELLULE_SERPENT);
    }

    this.cellules[tete.lig][tete.col].classList.add(CSS_CELLULE_TETE);
    this.cellules[nourriture.lig][nourriture.col].classList.add(CSS_CELLULE_NOURR);
  }

  effacer() {
    for (let lig = 0; lig < LIGNES; lig++) {
      for (let col = 0; col < COLONNES; col++) {
        const cl = this.cellules[lig][col].classList;
        cl.remove(CSS_CELLULE_SERPENT, CSS_CELLULE_TETE, CSS_CELLULE_NOURR);
      }
    }
  }
}
