import Routeur from './commun/Routeur.js';
import GestionnaireVues from './commun/GestionnaireVues.js';
import DepotLocal from './commun/DepotLocal.js';
import GestionnaireProfils from './profil/GestionnaireProfils.js';
import DepotScores from './score/DepotScores.js';
import AccueilUI from './accueil/AccueilUI.js';

const app = document.getElementById('app');
const depotGlobal = DepotLocal.creerGlobal();
const gestionnaireProfils = new GestionnaireProfils(depotGlobal);
const depotScores = new DepotScores(depotGlobal);

const registreJeux = [
  // import JeuSnake from './jeux/snake/JeuSnake.js'; → ajouté en phase 1
];

const gestionnaireVues = new GestionnaireVues(app);
const routeur = new Routeur(app);

gestionnaireVues.enregistrerVue('accueil', () =>
  new AccueilUI(app, routeur, registreJeux, gestionnaireProfils)
);

routeur.enregistrerRoute(
  'accueil',
  () => gestionnaireVues.afficherVue('accueil')
);

// Les routes de jeux seront enregistrées ici au fil des phases :
// routeur.enregistrerRoute('snake', () => gestionnaireVues.afficherVue('snake'));

routeur.demarrer();
