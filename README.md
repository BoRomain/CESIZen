# CESIZen

CESIZen est une application full-stack conçue pour offrir une expérience utilisateur fluide pour l'accès à l'information et aux activités. Elle se compose de trois composants principaux : une API backend, un panneau d'administration et une application mobile.

🌐 **Application en production** : [Panel Admin](https://admin.cesizen-romainb.duckdns.org)

---

## Table des matières

- [Structure du projet](#structure-du-projet)
- [Architecture générale](#architecture-générale)
- [Démarrage local](#démarrage-local)
- [Déploiement](#déploiement)
- [CI/CD](#cicd)
- [Versioning](#versioning)
- [Maintenance](#maintenance)
- [Sécurité](#sécurité)
- [RGPD](#rgpd)
- [Scripts disponibles](#scripts-disponibles)

---

## Structure du Projet

Le dépôt est un monorepo contenant les paquets suivants :

```
CESIZen/
├── BackAPI/               # Backend Node.js / Express / Prisma
├── admin-panel/           # Frontend admin React (Vite)
├── cesizen-native/        # Application mobile React Native (Expo)
├── docker-compose.yml     # Orchestration locale
├── docker-compose.prod.yml # Orchestration production
├── traefik/
│   └── traefik.yml        # Configuration du reverse proxy
├── .github/
│   └── workflows/         # Pipelines CI/CD
└── .env.example           # Modèle de variables d'environnement
```

---

## Architecture générale

```
Internet
   │
   ▼
Traefik (reverse proxy, TLS Let's Encrypt) — Port 443
   │
   ├──▶ admin-panel  (React/Vite)   — /
   └──▶ BackAPI      (Express)      — /api
            │
            ▼
       PostgreSQL (réseau Docker interne uniquement)
```

L'ensemble est hébergé sur une **VM Azure** (Ubuntu 22.04) et orchestré avec **Docker Compose**. Traefik gère automatiquement les certificats TLS via Let's Encrypt.

---

## Démarrage local

### Prérequis

- Node.js (v18 ou supérieure recommandée)
- npm ou yarn
- Une base de données PostgreSQL
- Docker & Docker Compose (optionnel, recommandé)

### Option 1 — Avec Docker (recommandé)

```bash
git clone https://github.com/BoRomain/CESIZen
cd CESIZen

cp .env.example .env
# Remplir les valeurs dans .env

docker compose up -d
```

L'API sera accessible sur `http://localhost:3000`, le panel admin sur `http://localhost:5173`.

### Option 2 — Sans Docker

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/BoRomain/CESIZen
    cd CESIZen
    ```

2. Installez les dépendances pour chaque paquet. Il est recommandé d'ouvrir trois terminaux distincts pour cela.

    - **Pour l'API Backend :**
        ```bash
        cd BackAPI
        npm install
        ```

    - **Pour le Panneau d'Administration :**
        ```bash
        cd admin-panel
        npm install
        ```

    - **Pour l'Application Mobile :**
        ```bash
        cd cesizen-native
        npm install
        ```

### Configuration

Le backend nécessite un fichier `.env` avec la chaîne de connexion à la base de données.

1. Accédez au répertoire `BackAPI` :
    ```bash
    cd BackAPI
    ```

2. Créez un fichier `.env` :
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="votre_secret_jwt"
    PORT=3000
    ```

3. Exécutez les migrations de la base de données :
    ```bash
    npx prisma migrate dev
    ```

4. (Optionnel) Remplissez la base de données avec des données initiales :
    ```bash
    npm run seed
    ```

### Lancement de l'Application

- **API Backend (`BackAPI`):**
    ```bash
    # Depuis le répertoire BackAPI
    npm run dev
    ```
    Le serveur démarrera sur le port configuré (par ex., http://localhost:3000).

- **Panneau d'Administration (`admin-panel`):**
    ```bash
    # Depuis le répertoire admin-panel
    npm run dev
    ```
    Le serveur de développement démarrera, généralement sur http://localhost:5173.

- **Application Mobile (`cesizen-native`):**
    ```bash
    # Depuis le répertoire cesizen-native
    npm start
    ```
    Cela démarrera le serveur de développement Expo. Vous pouvez ensuite lancer l'application sur un émulateur Android, un simulateur iOS, ou sur votre appareil physique en utilisant l'application Expo Go.

---

## Déploiement

### Environnement de production

| Élément | Détail |
|---|---|
| Hébergeur | Microsoft Azure (VM) |
| OS | Ubuntu 22.04 LTS |
| Reverse proxy | Traefik v3 |
| Orchestration | Docker Compose |
| TLS | Let's Encrypt (automatique via Traefik) |

### Déploiement manuel (première installation)

```bash
# 1. Se connecter à la VM
ssh user@IP_VM_AZURE

# 2. Cloner le dépôt
git clone https://github.com/BoRomain/CESIZen
cd CESIZen

# 3. Configurer les variables d'environnement
cp .env.example .env
nano .env  # Remplir les valeurs de production

# 4. Démarrer les conteneurs
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 5. Vérifier que tout tourne
docker compose ps
docker compose logs --tail=50
```

### Mise à jour en production

```bash
# Sur la VM Azure
cd CESIZen
git pull
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --no-deps
```

> Le pipeline CI/CD effectue ces étapes automatiquement à chaque push sur `main`. Voir la section [CI/CD](#cicd).

---

## CI/CD

Le pipeline est configuré avec **GitHub Actions** (`.github/workflows/deploy.yml`).

### Déclencheur

- Push sur la branche `main`
- Création d'un tag `v*.*.*`

### Étapes du pipeline

```
1. Lint & Tests        → Vérification qualité du code
2. Build Docker        → Construction des images
3. Push Registry       → Publication sur GitHub Container Registry (ghcr.io)
4. Deploy              → SSH sur la VM Azure + docker compose pull + up
```

### Variables GitHub Actions requises (Secrets)

| Secret | Description |
|---|---|
| `AZURE_VM_HOST` | IP ou hostname de la VM |
| `AZURE_VM_USER` | Utilisateur SSH |
| `AZURE_SSH_KEY` | Clé privée SSH |
| `GHCR_TOKEN` | Token GitHub Container Registry |

---

## Versioning

### Stratégie de branches

| Branche | Usage |
|---|---|
| `main` | Code stable, déclenche le déploiement en production |
| `develop` | Intégration des nouvelles fonctionnalités |
| `feature/nom` | Développement d'une fonctionnalité |
| `fix/nom` | Correction de bug |
| `hotfix/nom` | Correctif urgent en production |

### Convention de commits

Ce projet suit les [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
feat: ajout de la page de connexion
fix: correction du calcul de score
docs: mise à jour du README
chore: mise à jour des dépendances
```

### Créer une release

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

---

## Maintenance

### Signalement d'un bug

Les bugs sont suivis via [GitHub Issues](https://github.com/BoRomain/CESIZen/issues).

Pour signaler un bug, ouvrir une issue en utilisant le template **Bug Report** avec :
- Description du comportement observé
- Étapes pour reproduire
- Comportement attendu
- Captures d'écran si pertinent

### Procédure de correction

```
Signalement (Issue) → Triage → Branche fix/ → PR → Review → Merge → Déploiement
```

| Criticité | Délai de résolution cible |
|---|---|
| Bloquant (prod down) | < 4h |
| Majeur (fonctionnalité KO) | < 48h |
| Mineur (cosmétique) | Prochain sprint |

### Mise à jour des dépendances

```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les images Docker en production
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Sécurité

### Mesures en place

- **HTTPS obligatoire** : Traefik redirige tout le trafic HTTP vers HTTPS avec un certificat Let's Encrypt
- **Secrets externalisés** : aucune clé ou mot de passe dans le code source — tout passe par les variables d'environnement (`.env`, GitHub Secrets)
- **Réseau Docker isolé** : la base de données n'est pas exposée à l'extérieur
- **Images non-root** : les conteneurs tournent sans privilèges root
- **Mise à jour régulière** des images de base Docker (veille sur les CVE)

### Signaler une vulnérabilité

Pour signaler une faille de sécurité, **ne pas ouvrir une issue publique**. Contacter directement l'équipe à : `[votre email]`

---

## RGPD

CESIZen collecte et traite des données personnelles dans le respect du RGPD :

- **Données collectées** : adresse e-mail, prénom/nom (à adapter selon ton appli)
- **Finalité** : authentification et personnalisation de l'expérience
- **Durée de conservation** : données supprimées 3 ans après la dernière activité
- **Droits** : accès, rectification, suppression sur simple demande à `[votre email]`
- **Chiffrement** : les mots de passe sont hachés (bcrypt), les échanges chiffrés en TLS

---

## Scripts Disponibles

### BackAPI

- `npm run dev`: Démarre le serveur de développement avec rechargement à chaud.
- `npm run start`: Démarre l'application en production.
- `npm test`: Lance la suite de tests.
- `npm run seed`: Remplit la base de données.

### admin-panel

- `npm run dev`: Démarre le serveur de développement Vite.
- `npm run build`: Construit l'application pour la production.
- `npm run lint`: Analyse le code source.

### cesizen-native

- `npm start`: Démarre le serveur de développement Expo.
- `npm run android`: Démarre l'application sur un appareil ou émulateur Android connecté.
- `npm run ios`: Démarre l'application sur un simulateur iOS.
- `npm run web`: Exécute l'application dans un navigateur web.