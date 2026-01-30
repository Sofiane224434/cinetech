# 🎬 Guide de Déploiement - Cinetech sur VPS

## 📋 Prérequis

- ✅ Sous-domaine: `moviedb.azim404.com` créé sur OVH
- ✅ VPS avec Docker, Caddy et Portainer
- ✅ Réseau Docker: `azim-main_web`
- ✅ Repository GitHub avec le code

---

## 1️⃣ Configuration DNS sur OVH

### Sur le panel OVH:

1. Allez dans **Web Cloud** → **Noms de domaine** → `azim404.com`
2. Onglet **Zone DNS** → **Ajouter une entrée**
3. Ajoutez un enregistrement **A**:
   - Sous-domaine: `moviedb`
   - Cible: `Votre_IP_VPS` (même IP que azim404.com)
   - TTL: 3600 (1 heure)
4. Cliquez sur **Valider**
5. ⏳ Attendez 30 min à 4h pour la propagation

### Vérifier la propagation:

```bash
# Sur votre machine locale
nslookup moviedb.azim404.com
# ou
ping moviedb.azim404.com
```

---

## 2️⃣ Configuration sur le VPS

### Connexion SSH:

```bash
ssh debian@VOTRE_IP_VPS
```

### Cloner le projet:

```bash
cd ~/apps
git clone https://github.com/VOTRE_USERNAME/cinetech.git
cd cinetech
```

### Construire et démarrer le container:

```bash
# Vérifier que le réseau existe
docker network ls | grep azim-main_web

# Construire l'image
docker-compose build

# Démarrer le container
docker-compose up -d

# Vérifier que ça tourne
docker ps | grep cinetech
docker logs cinetech
```

---

## 3️⃣ Configuration du Caddyfile

### Éditer le Caddyfile:

```bash
cd ~/apps/azim-main
nano Caddyfile
```

### Ajouter cette configuration (copiez depuis CADDY_CONFIG.txt):

```caddy
# Redirect HTTP to HTTPS pour moviedb
http://moviedb.azim404.com {
 redir https://moviedb.azim404.com{uri} permanent
}

# HTTPS configuration avec headers de sécurité
moviedb.azim404.com {
 reverse_proxy cinetech:80

 header {
  Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  X-Content-Type-Options "nosniff"
  X-Frame-Options "DENY"
  X-XSS-Protection "1; mode=block"
 }
}
```

### Recharger Caddy:

```bash
# Recharger sans downtime
docker exec caddy caddy reload --config /etc/caddy/Caddyfile

# OU redémarrer complètement
cd ~/apps/azim-main
docker-compose restart caddy
```

### Vérifier les logs Caddy:

```bash
docker logs caddy
```

---

## 4️⃣ Tester le site

```bash
# Tester en local sur le VPS
curl http://localhost:80 -H "Host: moviedb.azim404.com"

# Tester HTTPS (une fois DNS propagé)
curl https://moviedb.azim404.com
```

### Dans votre navigateur:

Ouvrez `https://moviedb.azim404.com` - le certificat SSL sera automatiquement généré par Caddy via Let's Encrypt! 🎉

---

## 5️⃣ Configuration GitHub Actions pour Push Automatique

### Créer une clé SSH pour GitHub:

```bash
# Sur le VPS
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions  # Copiez cette clé privée
```

### Configurer les Secrets GitHub:

1. Allez sur GitHub → Votre repo `cinetech` → **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret** et ajoutez:

| Nom du Secret  | Valeur                                                   |
| -------------- | -------------------------------------------------------- |
| `VPS_HOST`     | Votre IP VPS                                             |
| `VPS_USERNAME` | `debian`                                                 |
| `VPS_SSH_KEY`  | La clé privée copiée (tout le contenu de github_actions) |

### Tester le workflow:

```bash
# Sur votre machine locale
git add .
git commit -m "feat: setup auto-deploy"
git push origin main
```

### Vérifier l'exécution:

- Allez sur GitHub → **Actions**
- Vous verrez le workflow s'exécuter
- Si tout est OK ✅, votre site sera automatiquement déployé!

---

## 6️⃣ Commandes Utiles

### Voir les logs:

```bash
docker logs cinetech -f           # Logs en temps réel
docker logs cinetech --tail 100   # 100 dernières lignes
```

### Redémarrer le container:

```bash
cd ~/apps/cinetech
docker-compose restart
```

### Mettre à jour manuellement:

```bash
cd ~/apps/cinetech
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Nettoyer les images inutilisées:

```bash
docker image prune -f
docker system prune -f
```

### Vérifier l'utilisation des ressources:

```bash
docker stats cinetech
```

---

## 🐛 Dépannage

### Le site ne charge pas:

```bash
# 1. Vérifier que le container tourne
docker ps | grep cinetech

# 2. Vérifier les logs
docker logs cinetech

# 3. Tester le container directement
docker exec -it cinetech sh
wget -O- http://localhost

# 4. Vérifier le réseau
docker network inspect azim-main_web | grep cinetech
```

### Erreur 502 Bad Gateway:

```bash
# Le container est peut-être arrêté
docker-compose up -d

# Vérifier que cinetech est bien sur le réseau azim-main_web
docker inspect cinetech | grep Networks -A 5
```

### DNS ne fonctionne pas:

```bash
# Vérifier la propagation
dig moviedb.azim404.com

# Vérifier la config Caddy
docker exec caddy cat /etc/caddy/Caddyfile | grep moviedb
```

### SSL ne marche pas:

```bash
# Vérifier les logs Caddy
docker logs caddy | grep moviedb

# S'assurer que les ports 80 et 443 sont accessibles
curl -I http://moviedb.azim404.com
```

### GitHub Actions échoue:

```bash
# Vérifier que la clé SSH est correcte
# Sur le VPS:
cat ~/.ssh/authorized_keys | grep github-actions

# Tester la connexion SSH manuellement
ssh -i ~/.ssh/github_actions debian@VOTRE_IP
```

---

## 📝 Variables d'Environnement (si nécessaire)

Si vous avez des clés API (ex: TMDB):

### 1. Créer un fichier .env sur le VPS:

```bash
cd ~/apps/cinetech
nano .env
```

Ajoutez:

```env
VITE_TMDB_API_KEY=votre_cle_api
```

### 2. Modifier docker-compose.yml:

```yaml
services:
  cinetech:
    build: .
    container_name: cinetech
    restart: unless-stopped
    env_file: .env # Ajoutez cette ligne
    networks:
      - azim-main_web
```

### 3. Rebuild:

```bash
docker-compose down
docker-compose up -d --build
```

---

## 🎯 Architecture Finale

```
Internet (HTTPS)
       ↓
moviedb.azim404.com
       ↓
   Caddy:443 (SSL automatique)
       ↓
   cinetech:80 (container)
       ↓
   Nginx (dans le container)
       ↓
   Application React (dist/)
```

---

## ✅ Checklist de Déploiement

- [ ] DNS configuré sur OVH (enregistrement A)
- [ ] Projet cloné dans `~/apps/cinetech`
- [ ] Container construit et démarré (`docker-compose up -d`)
- [ ] Configuration ajoutée au Caddyfile
- [ ] Caddy rechargé (`caddy reload`)
- [ ] Secrets GitHub configurés (VPS_HOST, VPS_USERNAME, VPS_SSH_KEY)
- [ ] Test GitHub Actions (push sur main)
- [ ] Site accessible sur `https://moviedb.azim404.com`
- [ ] SSL fonctionnel (cadenas vert)

---

## 🚀 Push Automatique Activé!

Maintenant, à chaque `git push origin main`:

1. GitHub Actions se déclenche
2. Se connecte au VPS via SSH
3. Pull les derniers changements
4. Rebuild le container Docker
5. Redémarre avec le nouveau code
6. Nettoie les anciennes images

**Temps total: ~2-3 minutes** ⚡

---

Besoin d'aide ? Vérifiez les logs:

- Container: `docker logs cinetech`
- Caddy: `docker logs caddy`
- GitHub Actions: onglet Actions sur GitHub
