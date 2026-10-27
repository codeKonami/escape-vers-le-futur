# Escape vers le futur · CHRONO·MISSION

Chasse au trésor sur téléphone pour deux voyageurs du temps (8 et 11 ans), dans l'univers d'un film culte des années 80.
Neuf étapes : codes, énigmes, QR codes cachés dans la maison, mélodie à rejouer sur un vrai piano, course contre les jeeps, puis le code du coffre.

- **Le jeu** : https://codekonami.github.io/escape-vers-le-futur/
- **L'espace parent** (cartes à imprimer, solutions, outils de test) : https://codekonami.github.io/escape-vers-le-futur/#/parent

Conçu pour un Pixel 7 sous Google Chrome. Application 100 % front (React, TypeScript, Vite), sans serveur.
La progression est enregistrée dans le téléphone : on reprend où on en était après une mise en veille ou un rechargement.

## Installation

Il faut Node.js 24.

```bash
npm ci
npx playwright install chromium   # une seule fois, pour les tests de bout en bout
```

## Lancer en local

```bash
npm run dev
```

Puis ouvrir http://localhost:5173/escape-vers-le-futur/ (et `#/parent` pour l'espace parent).
Sur l'ordinateur, la caméra et le micro fonctionnent sur `localhost`. Depuis un téléphone, Chrome ne les autorise qu'en HTTPS : pour tester sur le Pixel, utilisez le site publié.

## Tests

```bash
npm test            # Vitest : réponses, notes et jauge, détection au micro, règles de la course
npm run test:e2e    # Playwright, profil Pixel 7 : parcours complets
npm run typecheck   # vérification TypeScript
```

Les tests relisent `src/config.ts` : ils restent valides si vous changez les réponses, les codes, les jetons ou la mélodie.
Les tests de bout en bout tournent sur un build spécial (`npm run build:e2e`) où la caméra, le micro, le son et le hasard sont remplacés par des doublures pilotables. Le site publié n'en contient aucune trace.

## Modifier le jeu : `src/config.ts`

Tout le paramétrage est dans ce seul fichier, commenté :

| Quoi | Où |
| --- | --- |
| Prénoms des enfants (cartes sous les oreillers) | `kids` |
| Textes, codes (2610, 1955), réponses acceptées, chiffres du coffre | `steps` |
| Mots cachés dans les QR codes (`ROQUE`, `GLACON`) | `steps[…].token` |
| Mélodie secrète et tempo | `melody` |
| Durée et difficulté de la course | `race` |
| Messages communs (QR trop tôt, caméra bloquée…) | `messages` |
| Adresse du site, utilisée dans les QR codes imprimés | `productionUrl` |

Le code du coffre (3912) n'est pas saisi à part : il assemble les `digit` des étapes, dans l'ordre.

**La mélodie** reprend le format Tone.js : chaque événement est `{ time, note, duration }` (`"4n"` = noire, `"2n"` = blanche), et `bpm` règle le tempo.
Les noms de notes (`G4`, `Bb4`…) sont les hauteurs attendues au micro, dans l'ordre. Les altérations comptent (un si n'est pas un si bémol).
L'octave est ignorée, sauf si vous passez `octaveMatters` à `true`.

> Si vous changez un jeton de QR code ou l'adresse du site, réimprimez les cartes.

## Déploiement

Chaque push sur `main` lance GitHub Actions (`.github/workflows/deploy.yml`) : vérification des types, Vitest et Playwright, puis publication sur GitHub Pages **seulement si tous les tests passent**.

Réglage à vérifier une fois : **Settings › Pages › Source : GitHub Actions**.

```bash
git add -A
git commit -m "Ma modification"
git push
```

Suivez le déploiement dans l'onglet **Actions** du dépôt (environ 2 minutes).

## Check-list du jour J

**La veille**

- [ ] Ouvrir l'espace parent et vérifier les prénoms sur les cartes.
- [ ] Cliquer sur « Imprimer les cartes » (A4, 2 cartes par ligne) et découper le long des pointillés.
- [ ] Cacher le QR « Mission terrain » dans la boîte ou sous le plateau du jeu d'échecs.
- [ ] Cacher le QR « Dernière pièce » sur la porte ou dans le réfrigérateur.
- [ ] Cacher le coffre dans le sacacopo, son cadenas réglé sur le code du coffre (affiché dans l'espace parent).
- [ ] Sur le Pixel 7, ouvrir le jeu et autoriser la caméra et le micro quand Chrome le demande.
- [ ] Tester le micro près du piano : espace parent › aller à l'étape 5, puis bouton oreille, et jouer les 4 notes.
- [ ] Tester un scan : aller à l'étape 3 et scanner la carte de l'échiquier.
- [ ] Remettre la partie à zéro : espace parent › « Recommencer la partie ».

**Le matin**

- [ ] Glisser la carte « Départ » (QR code) et la carte « Code secret » sous les oreillers indiqués sur les cartes.
- [ ] Charger le téléphone, monter la luminosité, couper le mode silencieux pour entendre la mélodie.
- [ ] Fermer l'onglet de l'espace parent (il affiche les solutions).

**En cas de souci**

- Caméra ou micro bloqués : dans Chrome, toucher l'icône à gauche de l'adresse › Autorisations, puis les réactiver.
- Le scanner de l'appli ne lit pas un QR : l'appareil photo du téléphone fonctionne aussi, il ouvre la bonne page.
- Une étape bloque : espace parent › « Aller à l'étape ».

## Organisation du code

```
src/
  config.ts       toute la configuration du jeu
  game/           logique pure, testée par Vitest (réponses, progression, jetons, notes, mélodie, course)
  devices/        caméra (qr-scanner), micro (pitchy), son (Tone.js), et leurs doublures de test
  components/     en-tête, fenêtre de réussite, cadre de visée, illustrations SVG du design
  screens/        un écran par type d'étape, plus l'espace parent
tests/
  unit/           Vitest
  e2e/            Playwright (profil Pixel 7)
```

Librairies : React, Tone.js (lecture de la mélodie), pitchy (hauteur des notes au micro), qr-scanner (lecture des QR codes), qrcode (cartes de l'espace parent).
