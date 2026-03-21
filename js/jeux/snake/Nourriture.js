import { COLONNES, LIGNES } from './constantesSnake.js';

export class Nourriture {
  constructor() {
    this._position = { col: 0, lig: 0 };
  }

  get position() {
    return this._position;
  }

  replacer(positionsOccupees) {
    let candidate;
    do {
      candidate = {
        col: Math.floor(Math.random() * COLONNES),
        lig: Math.floor(Math.random() * LIGNES),
      };
    } while (positionsOccupees.some(p => p.col === candidate.col && p.lig === candidate.lig));

    this._position = candidate;
  }
}
