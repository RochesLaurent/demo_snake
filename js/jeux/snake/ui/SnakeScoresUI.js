export default class SnakeScoresUI {
  constructor(elementConteneur, depotScores, gestionnaireProfils, { surRetour } = {}) {
    this._conteneur          = elementConteneur;
    this._depotScores        = depotScores;
    this._gestionnaireProfils = gestionnaireProfils;
    this._surRetour          = surRetour ?? null;
    this._overlay            = null;
    this._element            = null;
    this._filtreActif        = null;
  }

  afficher() {
    this._overlay = document.createElement('div');
    this._overlay.classList.add('modale-overlay');

    this._element = document.createElement('div');
    this._element.classList.add('modale-contenu', 'scores-ui');

    this._overlay.appendChild(this._element);
    this._conteneur.appendChild(this._overlay);
    this._rendu();
  }

  masquer() {
    if (this._overlay) {
      this._overlay.remove();
      this._overlay = null;
      this._element = null;
    }
  }

  _rendu() {
    const profils = this._gestionnaireProfils.listerTous();

    this._element.innerHTML = `
      <h2>Scores — Snake</h2>
      <div class="scores-filtres">
        <button class="filtre-btn ${this._filtreActif === null ? 'actif' : ''}" data-profil-id="">Classement général</button>
        ${profils.map(p => `
          <button class="filtre-btn ${this._filtreActif === p.id ? 'actif' : ''}" data-profil-id="${p.id}">${p.nom}</button>
        `).join('')}
      </div>
      <table class="scores-tableau">
        <thead>
          <tr><th>Rang</th><th>Joueur</th><th>Score</th><th>Niveau</th><th>Date</th></tr>
        </thead>
        <tbody>${this._lignesScores(profils)}</tbody>
      </table>
      <button class="btn btn--secondaire btn--fermer">Fermer</button>
    `;

    this._element.querySelectorAll('.filtre-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._filtreActif = btn.dataset.profilId || null;
        this._rendu();
      });
    });

    this._element.querySelector('.btn--fermer').addEventListener('click', () => {
      if (this._surRetour) this._surRetour();
    });
  }

  _lignesScores(profils) {
    let scores;
    if (this._filtreActif) {
      scores = this._depotScores.listerParJeuEtProfil('snake', this._filtreActif);
    } else {
      scores = this._depotScores.listerParJeu('snake');
    }

    scores = scores.sort((a, b) => b.points - a.points);

    if (scores.length === 0) {
      return '<tr><td colspan="5" class="scores-vide">Aucun score enregistré</td></tr>';
    }

    return scores.map((s, i) => {
      const profil = profils.find(p => p.id === s.profilId);
      const nomJoueur = profil?.nom ?? '—';
      const date = new Date(s.date).toLocaleDateString('fr-FR');
      return `<tr>
        <td>${i + 1}</td>
        <td>${nomJoueur}</td>
        <td>${s.points}</td>
        <td>${s.niveau}</td>
        <td>${date}</td>
      </tr>`;
    }).join('');
  }
}
