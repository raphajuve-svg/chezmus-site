# Chez Mus

Site vitrine de Chez Mus Burger & Kebab à Herstal, construit avec React et Vite.

## Développement

```bash
npm install
npm run dev
```

## Mapbox

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_MAPBOX_TOKEN=PASTE_THE_PUBLIC_MAPBOX_TOKEN_HERE
```

Le token n'est jamais stocké dans le code. Sans token, la section contact affiche automatiquement un fallback propre avec l'adresse et le bouton d'itinéraire.

## Vérification

```bash
npm run lint
npm run build
```
