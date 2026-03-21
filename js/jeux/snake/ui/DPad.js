export default class DPad {
  constructor(elementConteneur, callbackDirection) {
    this._conteneur = elementConteneur;
    this._callbackDirection = callbackDirection;
    this._element = null;
    this._ecouteurs = [];
  }

  afficher() {
    this._element = document.createElement('div');
    this._element.classList.add('dpad');
    this._element.innerHTML = `
      <button class="dpad__btn dpad__btn--haut"   aria-label="Haut">▲</button>
      <div class="dpad__milieu">
        <button class="dpad__btn dpad__btn--gauche" aria-label="Gauche">◀</button>
        <button class="dpad__btn dpad__btn--droite" aria-label="Droite">▶</button>
      </div>
      <button class="dpad__btn dpad__btn--bas"    aria-label="Bas">▼</button>
    `;

    const bindings = [
      ['.dpad__btn--haut',   'HAUT'],
      ['.dpad__btn--bas',    'BAS'],
      ['.dpad__btn--gauche', 'GAUCHE'],
      ['.dpad__btn--droite', 'DROITE'],
    ];

    for (const [selecteur, direction] of bindings) {
      const btn = this._element.querySelector(selecteur);
      const fn = (e) => {
        e.preventDefault();
        this._callbackDirection(direction);
      };
      btn.addEventListener('touchstart', fn, { passive: false });
      this._ecouteurs.push({ element: btn, fn });
    }

    this._conteneur.appendChild(this._element);
  }

  detruire() {
    for (const { element, fn } of this._ecouteurs) {
      element.removeEventListener('touchstart', fn);
    }
    this._ecouteurs = [];
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }
}
