import {
  COLONNES,
  LIGNES,
  CSS_CELLULE,
  CSS_CELLULE_SERPENT,
  CSS_CELLULE_TETE,
  CSS_CELLULE_NOURR,
} from './constantesSnake.js';

export default class Plateau {
  constructor(elementParent) {
    this.cellules = [];
    this._conteneur = document.createElement('div');
    this._conteneur.id = 'plateau-snake';
    this._conteneur.style.setProperty('--colonnes', COLONNES);

    for (let lig = 0; lig < LIGNES; lig++) {
      this.cellules[lig] = [];
      for (let col = 0; col < COLONNES; col++) {
        const cellule = document.createElement('div');
        cellule.classList.add(CSS_CELLULE);
        this._conteneur.appendChild(cellule);
        this.cellules[lig][col] = cellule;
      }
    }

    elementParent.appendChild(this._conteneur);
  }

  mettreAJour(serpent, nourriture) {
    this.effacer();

    const tete = serpent.tete;
    const corps = serpent.corps;

    for (const segment of corps) {
      this.cellules[segment.lig][segment.col].classList.add(CSS_CELLULE_SERPENT);
    }

    this.cellules[tete.lig][tete.col].classList.add(CSS_CELLULE_TETE);

    const posNourr = nourriture.position;
    this.cellules[posNourr.lig][posNourr.col].classList.add(CSS_CELLULE_NOURR);
  }

  effacer() {
    for (let lig = 0; lig < LIGNES; lig++) {
      for (let col = 0; col < COLONNES; col++) {
        const cl = this.cellules[lig][col].classList;
        cl.remove(CSS_CELLULE_SERPENT, CSS_CELLULE_TETE, CSS_CELLULE_NOURR);
      }
    }
  }

  detruire() {
    this._conteneur.remove();
  }
}
