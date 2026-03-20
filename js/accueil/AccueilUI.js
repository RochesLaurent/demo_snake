export default class AccueilUI {
  constructor(elementConteneur, routeur, registreJeux, gestionnaireProfils) {
    this._elementConteneur = elementConteneur;
    this._routeur = routeur;
    this._registreJeux = registreJeux;
    this._gestionnaireProfils = gestionnaireProfils;
    this._element = null;
    this._ecouteurs = [];
  }

  afficher() {
    this._element = this._creerDOM();
    this._elementConteneur.appendChild(this._element);
    this._attacherEcouteurs();
  }

  masquer() {
    if (this._element) {
      this._element.style.display = 'none';
    }
  }

  detruire() {
    this._detacherEcouteurs();
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  _creerDOM() {
    const racine = document.createElement('div');
    racine.className = 'accueil';

    racine.innerHTML = `
      <header class="accueil__entete">
        <h1>PlaygroundJS</h1>
        <p>Collection de jeux en Vanilla JavaScript</p>
      </header>
      <div class="accueil__grille"></div>
      <footer class="accueil__pied">
        <button class="btn btn--profils">Gérer les profils</button>
      </footer>
    `;

    const grille = racine.querySelector('.accueil__grille');
    for (const classeJeu of this._registreJeux) {
      grille.appendChild(this._creerCarteJeu(classeJeu));
    }

    return racine;
  }

  _creerCarteJeu(classeJeu) {
    const carte = document.createElement('article');
    carte.className = 'carte-jeu';
    carte.dataset.jeu = classeJeu.ID;
    carte.setAttribute('tabindex', '0');
    carte.innerHTML = `
      <span class="carte-jeu__icone">${classeJeu.ICONE}</span>
      <h2 class="carte-jeu__nom">${classeJeu.NOM}</h2>
      <p class="carte-jeu__description">${classeJeu.DESCRIPTION}</p>
    `;
    return carte;
  }

  _attacherEcouteurs() {
    const gestionnaireClic = (evenement) => {
      const carte = evenement.target.closest('.carte-jeu');
      if (carte) {
        this._routeur.naviguerVers(carte.dataset.jeu);
      }
    };
    const gestionnaireClavier = (evenement) => {
      if (evenement.key === 'Enter' || evenement.key === ' ') {
        const carte = evenement.target.closest('.carte-jeu');
        if (carte) {
          evenement.preventDefault();
          this._routeur.naviguerVers(carte.dataset.jeu);
        }
      }
    };

    const btnProfils = this._element.querySelector('.btn--profils');
    const gestionnaireProfils = () => {
      alert('Gestion des profils — à implémenter');
    };

    this._element.addEventListener('click', gestionnaireClic);
    this._element.addEventListener('keydown', gestionnaireClavier);
    btnProfils.addEventListener('click', gestionnaireProfils);

    this._ecouteurs = [
      { element: this._element, type: 'click',   fn: gestionnaireClic },
      { element: this._element, type: 'keydown',  fn: gestionnaireClavier },
      { element: btnProfils,    type: 'click',    fn: gestionnaireProfils },
    ];
  }

  _detacherEcouteurs() {
    for (const { element, type, fn } of this._ecouteurs) {
      element.removeEventListener(type, fn);
    }
    this._ecouteurs = [];
  }
}
