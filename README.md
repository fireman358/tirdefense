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

`wrangler.jsonc` sert le site en assets statiques et route `/api/*` vers le Worker (`src/index.js`).

## Newsletter (Resend)

Le formulaire poste sur `/api/subscribe`. Le Worker ajoute le contact à une audience Resend.

Secrets à créer **une seule fois** :

```bash
npx wrangler secret put RESEND_API_KEY        # clé API Resend
npx wrangler secret put RESEND_AUDIENCE_ID    # identifiant de l'audience Resend
```

Optionnel, pour un e-mail de bienvenue :

```bash
npx wrangler secret put RESEND_FROM           # ex. contact@tir-defense-belgique.be
```

Tant que les secrets ne sont pas posés, le formulaire répond « Inscription momentanément indisponible » — il n’échoue pas silencieusement.

## Préversion

Le site est en `noindex` (`_headers` + `robots.txt`). Pour passer en production sur le domaine : retirer ces deux fichiers et ajouter le domaine dans Cloudflare.

## Régénérer

Le générateur vit hors de ce dépôt (`tools/sitegen.py`), avec les notes dans `data/scores.json` et les partenariats dans `data/partenaires.json`.
