export default class SelecteurProfil {
  constructor(elementConteneur, gestionnaireProfils, {
    onSelect    = null,
    onFermer    = null,
    titreBouton = 'Jouer',
    modeGestion = false,
  } = {}) {
    this._conteneur         = elementConteneur;
    this._gestionProfils    = gestionnaireProfils;
    this._onSelect          = onSelect;
    this._onFermer          = onFermer;
    this._titreBouton       = titreBouton;
    this._modeGestion       = modeGestion;
    this._profilSelectionne = null;
    this._overlay           = null;
    this._ecouteurs         = [];
  }

  afficher() {
    this._overlay = this._creerDOM();
    this._conteneur.appendChild(this._overlay);
    this._attacherEcouteurs();

    const profils = this._gestionProfils.listerTous();
    if (profils.length === 0) {
      this._overlay.querySelector('.selecteur-profil__input')?.focus();
    }
  }

  masquer() {
    this._detacherEcouteurs();
    if (this._overlay) {
      this._overlay.remove();
      this._overlay = null;
    }
    this._profilSelectionne = null;
  }

  detruire() {
    this.masquer();
  }

  _creerDOM() {
    const overlay = document.createElement('div');
    overlay.classList.add('modale-overlay');

    const contenu = document.createElement('div');
    contenu.classList.add('modale-contenu');
    contenu.setAttribute('role', 'dialog');
    contenu.setAttribute('aria-modal', 'true');
    contenu.setAttribute('aria-labelledby', 'selecteur-profil-titre');

    contenu.innerHTML = `
      <button class="modale__fermer" aria-label="Fermer">✕</button>
      <h2 class="selecteur-profil__titre" id="selecteur-profil-titre">
        ${this._modeGestion ? 'Gérer les profils' : 'Choisir un profil'}
      </h2>
      <ul class="selecteur-profil__liste" aria-label="Liste des profils">
        ${this._rendreProfils()}
      </ul>
      <hr class="selecteur-profil__separateur" />
      <form class="selecteur-profil__form" novalidate>
        <input
          type="text"
          class="selecteur-profil__input"
          placeholder="Nouveau profil…"
          maxlength="20"
          autocomplete="off"
          aria-label="Nom du nouveau profil"
        />
        <button type="submit" class="btn btn--secondaire">Créer</button>
      </form>
      ${!this._modeGestion ? `
      <div class="selecteur-profil__actions">
        <button class="btn btn--primaire selecteur-profil__confirmer" disabled>
          ${this._titreBouton}
        </button>
      </div>` : ''}
    `;

    overlay.appendChild(contenu);
    return overlay;
  }

  _rendreProfils() {
    const profils = this._gestionProfils.listerTous();

    if (profils.length === 0) {
      return '<li class="selecteur-profil__vide">Aucun profil — créez-en un ci-dessous.</li>';
    }

    return profils.map(p => `
      <li
        class="selecteur-profil__item ${this._profilSelectionne?.id === p.id ? 'selecteur-profil__item--actif' : ''}"
        data-profil-id="${p.id}"
        tabindex="0"
        role="option"
        aria-selected="${this._profilSelectionne?.id === p.id}"
      >
        <span class="selecteur-profil__nom">${this._echapper(p.nom)}</span>
        <button
          class="selecteur-profil__supprimer"
          data-supprimer-id="${p.id}"
          aria-label="Supprimer ${this._echapper(p.nom)}"
        >✕</button>
      </li>
    `).join('');
  }

  _rafraichirListe() {
    const liste = this._overlay?.querySelector('.selecteur-profil__liste');
    if (liste) {
      liste.innerHTML = this._rendreProfils();
      this._attacherEcouteursListe();
    }
    this._majBoutonConfirmer();
  }

  _majBoutonConfirmer() {
    const btn = this._overlay?.querySelector('.selecteur-profil__confirmer');
    if (btn) {
      btn.disabled = this._profilSelectionne === null;
    }
  }


  _attacherEcouteurs() {
    const btnFermer = this._overlay.querySelector('.modale__fermer');
    const fermer = () => this._fermer();
    this._ajouter(btnFermer, 'click', fermer);

    const backdrop = (e) => {
      if (e.target === this._overlay) this._fermer();
    };
    this._ajouter(this._overlay, 'click', backdrop);

    const clavier = (e) => {
      if (e.key === 'Escape') this._fermer();
    };
    this._ajouter(document, 'keydown', clavier);

    const form = this._overlay.querySelector('.selecteur-profil__form');
    const soumettreForm = (e) => {
      e.preventDefault();
      const input = form.querySelector('.selecteur-profil__input');
      const nom = input.value.trim();
      if (nom) {
        const profil = this._gestionProfils.ajouter(nom);
        this._profilSelectionne = profil;
        input.value = '';
        this._rafraichirListe();
      }
    };
    this._ajouter(form, 'submit', soumettreForm);

    const btnConfirmer = this._overlay?.querySelector('.selecteur-profil__confirmer');
    if (btnConfirmer) {
      const confirmer = () => {
        if (this._profilSelectionne && this._onSelect) {
          this._onSelect(this._profilSelectionne);
        }
      };
      this._ajouter(btnConfirmer, 'click', confirmer);
    }

    this._attacherEcouteursListe();
  }

  _attacherEcouteursListe() {
    const liste = this._overlay?.querySelector('.selecteur-profil__liste');
    if (!liste) return;

    this._ecouteurs = this._ecouteurs.filter(({ element, type, fn }) => {
      if (element === liste) {
        element.removeEventListener(type, fn);
        return false;
      }
      return true;
    });

    const clicListe = (e) => {
      const btnSup = e.target.closest('.selecteur-profil__supprimer');
      if (btnSup) {
        e.stopPropagation();
        this._supprimerProfil(btnSup.dataset.supprimerId);
        return;
      }
      const item = e.target.closest('.selecteur-profil__item[data-profil-id]');
      if (item) {
        this._selectionnerProfil(item.dataset.profilId);
      }
    };
    this._ajouter(liste, 'click', clicListe);

    const clavierListe = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('.selecteur-profil__item[data-profil-id]');
        if (item) {
          e.preventDefault();
          this._selectionnerProfil(item.dataset.profilId);
        }
      }
    };
    this._ajouter(liste, 'keydown', clavierListe);
  }

  _detacherEcouteurs() {
    for (const { element, type, fn } of this._ecouteurs) {
      element.removeEventListener(type, fn);
    }
    this._ecouteurs = [];
  }

  _ajouter(element, type, fn) {
    element.addEventListener(type, fn);
    this._ecouteurs.push({ element, type, fn });
  }

  _selectionnerProfil(id) {
    const profil = this._gestionProfils.obtenirParId(id);
    if (!profil) return;
    this._profilSelectionne = profil;
    this._rafraichirListe();
  }

  _supprimerProfil(id) {
    if (this._profilSelectionne?.id === id) {
      this._profilSelectionne = null;
    }
    this._gestionProfils.supprimer(id);
    this._rafraichirListe();
  }

  _fermer() {
    this.masquer();
    if (this._onFermer) this._onFermer();
  }

  _echapper(texte) {
    return String(texte)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
