# cinetech

Application front Movie DB servie sur moviedb.azim404.com.

## Stack

- React + Vite
- Docker multi-stage avec Nginx dans le conteneur
- Nginx sur le VPS comme reverse proxy hote
- GitHub Actions pour le deploiement automatique

## Variables d'environnement

Copier .env.example vers .env pour le developpement local ou pour le build sur le VPS.

Variables attendues:

- VITE_TMDB_API_KEY
- VITE_TMDB_BASE_URL

## Developpement local

```bash
npm install
npm run dev
```

## Production reelle

- Le conteneur expose 127.0.0.1:3003:80
- Nginx sur le VPS route moviedb.azim404.com vers ce port
- Le TLS est gere au niveau hote par Certbot et Nginx
- Les build args Docker viennent du fichier .env local au repo de deploiement

## Deploiement

Le workflow deploye dans ~/apps/cinetech puis reconstruit l'image sur le VPS.

Secrets GitHub requis:

- VPS_HOST
- VPS_USERNAME
- VPS_SSH_KEY

## Point critique

Ne jamais committer de vraie cle TMDB dans le repo. Utiliser .env en local et .env.example comme modele.
