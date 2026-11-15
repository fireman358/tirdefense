# tirdefense

Site statique de **Tir et Défense Belgique** — refonte « Piste D », généré depuis le clone local.

## Contenu

- 71 pages : 51 articles, 4 catégories paginées, 5 pages fixes, méthode, auteur, recherche, 404
- CSS unique (`assets/style.css`), polices Google Fonts
- Images dans `wp-content/uploads`

## Déploiement sur Cloudflare Workers

```bash
npx wrangler deploy
```

`wrangler.jsonc` sert uniquement des assets statiques : aucun Worker, aucune fonction serveur, aucune base de données.

## Ce qu'il n'y a pas (volontairement)

- **Aucune collecte d'e-mail.** Pas de newsletter, pas de formulaire d'inscription : rien à déclarer côté RGPD.
- **Aucun analytics embarqué.** Pas de Google Tag Manager dans les pages de préversion.
- **Aucun cookie de suivi** posé par le site lui-même.

## Préversion

Le site est en `noindex` (`_headers` + `robots.txt`). Pour passer en production sur le domaine : retirer ces deux fichiers et ajouter le domaine dans Cloudflare.

## Régénérer

Le générateur vit hors de ce dépôt (`tools/sitegen.py`), avec les notes dans `data/scores.json` et les partenariats dans `data/partenaires.json`.
