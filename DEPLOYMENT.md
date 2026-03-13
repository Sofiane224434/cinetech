# Deploiement Cinetech

Ce projet est deploye sur le VPS avec l'architecture reelle suivante:

- DNS OVH vers l'IP du VPS
- Nginx installe sur l'hote
- Certbot sur l'hote pour le TLS
- Docker Compose dans ~/apps/cinetech
- Conteneur accessible uniquement sur 127.0.0.1:3003

## DNS

Le sous-domaine attendu est moviedb.azim404.com.

## Secrets GitHub Actions

- VPS_HOST
- VPS_USERNAME
- VPS_SSH_KEY

Le port SSH est actuellement fixe a 2222 dans le workflow.

## Preparation du VPS

```bash
docker network inspect web >/dev/null 2>&1 || docker network create web
mkdir -p ~/apps/cinetech
cd ~/apps/cinetech
cp .env.example .env
```

Puis renseigner au minimum:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

## Deploiement manuel de secours

```bash
cd ~/apps/cinetech
git fetch origin
git reset --hard origin/main
git clean -fd -e .env
docker compose down || true
docker compose up -d --build
```

## Verification

```bash
cd ~/apps/cinetech
docker compose ps
docker compose logs --tail=100
curl -I https://moviedb.azim404.com
```

## A ne pas faire

- Ne pas reintroduire Traefik, Caddy, Portainer ou un proxy secondaire dans ce repo
- Ne pas committer de vraie cle API dans .env ou docker-compose.yml
