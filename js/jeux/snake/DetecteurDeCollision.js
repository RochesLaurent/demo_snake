import { COLONNES, LIGNES } from './constantesSnake.js';

export class DetecteurDeCollision {
  static avecMur(position) {
    return (
      position.col < 0 ||
      position.col >= COLONNES ||
      position.lig < 0 ||
      position.lig >= LIGNES
    );
  }

  static avecCorps(tete, segments) {
    return segments.slice(1).some(seg => seg.col === tete.col && seg.lig === tete.lig);
  }

  static avecNourriture(tete, posNourriture) {
    return tete.col === posNourriture.col && tete.lig === posNourriture.lig;
  }
}
