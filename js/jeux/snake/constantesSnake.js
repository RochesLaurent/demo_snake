export const COLONNES = 20;
export const LIGNES = 20;

export const VITESSE_INITIALE = 200;
export const ACCELERATION_PAR_NIVEAU = 10;
export const VITESSE_MINIMALE = 60;

export const POINTS_PAR_NOURRITURE = 10;
export const NOURRITURE_PAR_NIVEAU = 5;

export const DIRECTIONS = {
  HAUT:   { dc:  0, dl: -1, opposee: 'BAS'   },
  BAS:    { dc:  0, dl:  1, opposee: 'HAUT'  },
  GAUCHE: { dc: -1, dl:  0, opposee: 'DROITE'},
  DROITE: { dc:  1, dl:  0, opposee: 'GAUCHE'},
};

export const TOUCHES = {
  ArrowUp:    'HAUT',
  ArrowDown:  'BAS',
  ArrowLeft:  'GAUCHE',
  ArrowRight: 'DROITE',
  z: 'HAUT',
  s: 'BAS',
  q: 'GAUCHE',
  d: 'DROITE',
};

export const CSS_CELLULE         = 'cellule';
export const CSS_CELLULE_SERPENT = 'cellule--serpent';
export const CSS_CELLULE_TETE    = 'cellule--tete';
export const CSS_CELLULE_NOURR   = 'cellule--nourriture';
