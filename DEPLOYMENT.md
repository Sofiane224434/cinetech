# Guide de Déploiement - Cinetech

## 1. Configuration du sous-domaine OVH

### Sur le panel OVH:

1. Allez dans "Web Cloud" → "Noms de domaine" → Sélectionnez votre domaine
2. Onglet "Zone DNS" → "Ajouter une entrée"
3. Ajoutez un enregistrement:
   - **Type A**: `sous-domaine` → `IP_DE_VOTRE_VPS`
   - Ou **CNAME**: `sous-domaine` → `domaine-principal.com`
4. Temps de propagation: 4-24h

## 2. Configuration sur le VPS

### Installation Docker (si non installé):

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Configuration Nginx Proxy Manager (recommandé) ou Traefik:

#### Option A: Nginx Proxy Manager

```bash
# docker-compose.yml pour Nginx Proxy Manager
version: '3.8'
services:
  nginx-proxy:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

1. Accédez à `http://IP_VPS:81`
2. Login: `admin@example.com` / `changeme`
3. Ajoutez un "Proxy Host":
   - Domain: `sous-domaine.votredomaine.com`
   - Forward IP: `cinetech` (nom du container)
   - Forward Port: `80`
   - Activez SSL (Let's Encrypt)

#### Option B: Traefik

```yaml
# docker-compose.yml avec Traefik
version: "3.8"

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.email=votre@email.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt

  cinetech:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cinetech.rule=Host(`sous-domaine.votredomaine.com`)"
      - "traefik.http.routers.cinetech.entrypoints=websecure"
      - "traefik.http.routers.cinetech.tls.certresolver=myresolver"
```

## 3. Configuration Portainer pour Webhooks

### Créer un Webhook dans Portainer:

1. Allez dans Portainer → Stacks → Sélectionnez votre stack
2. Cliquez sur "Webhooks" → "Add webhook"
3. Copiez l'URL du webhook (ex: `https://portainer.votredomaine.com/api/webhooks/xxx`)

## 4. Configuration GitHub Actions

### Secrets à ajouter dans GitHub:

1. Allez dans votre repo → Settings → Secrets and variables → Actions
2. Ajoutez ces secrets:
   - `DOCKER_USERNAME`: votre username Docker Hub
   - `DOCKER_PASSWORD`: votre token Docker Hub
   - `PORTAINER_URL`: `https://portainer.votredomaine.com`
   - `PORTAINER_WEBHOOK_ID`: l'ID du webhook

   **OU pour déploiement SSH:**
   - `VPS_HOST`: IP de votre VPS
   - `VPS_USERNAME`: votre username SSH
   - `VPS_SSH_KEY`: votre clé privée SSH

## 5. Déploiement Initial

### Sur votre VPS:

```bash
# Créer le réseau Docker
docker network create web

# Cloner le repo
git clone https://github.com/votre-username/cinetech.git
cd cinetech

# Construire et lancer
docker-compose up -d
```

## 6. Configuration Stack Portainer (alternative)

1. Dans Portainer → Stacks → Add stack
2. Nom: `cinetech`
3. Repository: `https://github.com/votre-username/cinetech.git`
4. Compose path: `docker-compose.yml`
5. Environment variables (si nécessaire)
6. Activez "Auto-update" avec webhook

## 7. Workflow Automatique

Maintenant, à chaque push sur la branche `main`:

1. GitHub Actions construit l'image Docker
2. Pousse l'image sur Docker Hub
3. Appelle le webhook Portainer
4. Portainer redémarre le container avec la nouvelle image

## Vérification

```bash
# Voir les logs
docker logs cinetech

# Vérifier que le container tourne
docker ps

# Tester l'application
curl https://sous-domaine.votredomaine.com
```

## Dépannage

- **DNS ne fonctionne pas**: Attendez 24h pour propagation
- **502 Bad Gateway**: Vérifiez que le container cinetech tourne
- **SSL échoue**: Vérifiez que le port 80 est ouvert et accessible
- **GitHub Actions échoue**: Vérifiez les secrets dans GitHub

## Variables d'environnement

Si vous avez besoin de variables d'environnement (ex: clés API):

1. Créez un fichier `.env` sur le VPS
2. Ajoutez dans `docker-compose.yml`:

```yaml
services:
  cinetech:
    env_file: .env
```
