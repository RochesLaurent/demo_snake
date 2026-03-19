# demo_snake

Jeu Snake développé en Vanilla JS / HTML / CSS, **sans `<canvas>`**, dans le cadre d'un projet d'étude.

## Fonctionnalités

- Jouer au Snake avec contrôle au clavier
- Créer et gérer plusieurs profils joueurs
- Scores enregistrés localement (localStorage)
- Tableau comparatif des scores entre profils

## Stack technique

- HTML5 / CSS3
- JavaScript ES6 (Modules natifs, POO, SOLID, Clean Code)
- Aucune dépendance externe

## Lancement local

Les modules ES6 nécessitent un serveur HTTP local :

```bash
npx serve .
```

Puis ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Déploiement

Hébergé sur **Vercel** : *(lien à compléter)*

```bash
vercel        # première fois
vercel --prod # déploiements suivants
```

---

## Architecture

### Structure des fichiers

```
demo_snake/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js                      # Point d'entrée — instancie et lance l'application
    ├── constantes.js                # Toutes les constantes nommées (taille grille, vitesse…)
    ├── jeu/
    │   ├── Jeu.js                   # Orchestrateur principal du jeu
    │   ├── BoucleDeJeu.js           # Boucle de jeu (setInterval / requestAnimationFrame)
    │   ├── Plateau.js               # Rendu DOM de la grille
    │   ├── Serpent.js               # Entité serpent (position, direction, croissance)
    │   ├── Nourriture.js            # Entité nourriture (position aléatoire)
    │   └── DetecteurDeCollision.js  # Détection collisions (murs, soi-même, nourriture)
    ├── profil/
    │   ├── Profil.js                # Modèle de données d'un profil joueur
    │   └── GestionnaireProfils.js   # CRUD profils (création, sélection, suppression)
    ├── score/
    │   ├── Score.js                 # Modèle de données d'un score
    │   └── DepotScores.js           # Unique point d'accès au localStorage
    └── ui/
        ├── MenuUI.js                # Écran d'accueil et sélection de profil
        ├── JeuUI.js                 # HUD en cours de partie (score, niveau)
        └── TableauScoresUI.js       # Affichage et comparaison des scores
```

### Rendu DOM (sans canvas)

La grille est un tableau 2D de `<div class="cellule">`. Les états visuels sont portés par des classes CSS (`cellule--serpent`, `cellule--nourriture`). À chaque tick du jeu, seules les classes sont modifiées — les éléments DOM ne sont jamais recréés.

### Persistance

Seule la classe `DepotScores.js` accède au `localStorage`.

| Clé | Contenu |
|---|---|
| `snake_profils` | JSON array des profils joueurs |
| `snake_scores` | JSON array des scores avec référence au profil |

---

## Principes appliqués

### SOLID

| Principe | Application |
|---|---|
| **S** — Responsabilité unique | Chaque classe a un seul rôle (`Plateau` = rendu, `DetecteurDeCollision` = collisions…) |
| **O** — Ouvert/Fermé | Extensions par héritage ou composition, sans modifier le code existant |
| **L** — Substitution de Liskov | Toute sous-classe peut remplacer sa parente sans casser le comportement |
| **I** — Ségrégation des interfaces | Pas de classes "fourre-tout" — plusieurs petites classes ciblées |
| **D** — Inversion des dépendances | Les dépendances sont injectées via le constructeur |

### Clean Code

- Noms explicites en français : `calculerProchainMouvement()` plutôt que `calc()`
- Pas de magic numbers — constantes dans `constantes.js`
- Fonctions courtes (< 20 lignes), une seule responsabilité par fonction
- Commenter le *pourquoi*, pas le *quoi*

---

## Licence

MIT — voir [LICENSE](LICENSE)
