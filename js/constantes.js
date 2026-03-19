// Dimensions de la grille
export const COLONNES = 20;
export const LIGNES = 20;

// Vitesse de jeu (en millisecondes par tick)
export const VITESSE_INITIALE = 200;
export const ACCELERATION_PAR_NIVEAU = 10; // ms retirées à chaque niveau
export const VITESSE_MINIMALE = 60;        // plancher de vitesse

// Scoring
export const POINTS_PAR_NOURRITURE = 10;
export const NOURRITURE_PAR_NIVEAU = 5;   // nb de nourritures mangées pour passer au niveau suivant

// Directions (vecteurs [deltaColonne, deltaLigne])
export const DIRECTIONS = {
  HAUT:   { dc:  0, dl: -1, opposee: 'BAS'   },
  BAS:    { dc:  0, dl:  1, opposee: 'HAUT'  },
  GAUCHE: { dc: -1, dl:  0, opposee: 'DROITE'},
  DROITE: { dc:  1, dl:  0, opposee: 'GAUCHE'},
};

// Touches clavier
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

// Clés localStorage
export const CLE_PROFILS = 'snake_profils';
export const CLE_SCORES  = 'snake_scores';

// Classes CSS des cellules
export const CSS_CELLULE         = 'cellule';
export const CSS_CELLULE_SERPENT = 'cellule--serpent';
export const CSS_CELLULE_TETE    = 'cellule--tete';
export const CSS_CELLULE_NOURR   = 'cellule--nourriture';
