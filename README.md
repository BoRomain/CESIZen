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

### Niveaux de criticités

| Score | Niveau | Couleur | Traitement |
|---|---|---|---|
| 12–16 | Critique | 🔴 | Action immédiate requise |
| 6–11 | Élevé | 🟠 | Plan d'action sous 48h |
| 3–5 | Modéré | 🟡 | Surveillance renforcée |
| 1–2 | Faible | 🟢 | Accepté / suivi régulier |

---

## Matrice des risques

### Risques de Sécurité

| ID | Risque | P | I | Criticité | Niveau | Mesures de mitigation |
|---|---|---|---|---|---|---|
| SEC-01 | **Fuite de données personnelles (RGPD)** — accès non autorisé à la BDD | 2 | 4 | 8 | 🟠 | Chiffrement BDD, réseau Docker isolé, accès SSH restreint, audit trimestriel |
| SEC-02 | **Injection SQL** — requête malveillante en BDD | 2 | 4 | 8 | 🟠 | ORM avec requêtes paramétrées, validation d'entrées, tests OWASP ZAP |
| SEC-03 | **Attaque XSS** — injection de scripts dans les contenus | 3 | 3 | 9 | 🟠 | Échappement React, CSP stricte, sanitisation backend (validator.js) |
| SEC-04 | **Brute force sur les comptes** | 3 | 2 | 6 | 🟠 | Rate limiting (5 essais / 15 min), bcrypt coût 12, alertes email |
| SEC-05 | **Vol de token JWT** | 2 | 3 | 6 | 🟠 | Expiration courte (15 min), refresh token invalidable, HTTPS strict |
| SEC-06 | **Attaque CSRF** | 2 | 3 | 6 | 🟠 | Tokens CSRF, SameSite=Strict, validation Origin |
| SEC-07 | **Exposition de secrets dans le dépôt Git** | 2 | 4 | 8 | 🟠 | `.gitignore`, GitHub Secrets, scan GitGuardian |
| SEC-08 | **Vulnérabilité dans une dépendance npm** | 3 | 2 | 6 | 🟠 | `npm audit` en CI, Dependabot, mise à jour hebdomadaire |
| SEC-09 | **Attaque DDoS** | 2 | 3 | 6 | 🟠 | Rate limiting global Nginx, Cloudflare (si nécessaire) |
| SEC-10 | **Certificat SSL expiré** | 1 | 3 | 3 | 🟡 | Renouvellement auto Certbot, monitoring Uptime Robot |

### Risques d'Infrastructure

| ID | Risque | P | I | Criticité | Niveau | Mesures de mitigation |
|---|---|---|---|---|---|---|
| INF-01 | **Panne du VPS** — serveur inaccessible | 2 | 4 | 8 | 🟠 | Snapshot régulier, procédure de restauration documentée, RTO < 2h |
| INF-02 | **Saturation du disque** — espace insuffisant | 2 | 3 | 6 | 🟠 | Monitoring `df -h`, purge automatique des logs (> 30 jours) |
| INF-03 | **IP dynamique non mise à jour (DuckDNS)** | 2 | 3 | 6 | 🟠 | Cron toutes les 5 min, log de mise à jour, alerte sur échec |
| INF-04 | **Conteneur Docker en crash** | 2 | 3 | 6 | 🟠 | `restart: unless-stopped`, healthcheck, alertes Uptime Robot |
| INF-05 | **Corruption de la base de données** | 1 | 4 | 4 | 🟡 | Backup quotidien (mysqldump), rétention 30 jours, test de restauration mensuel |
| INF-06 | **Indisponibilité réseau hébergeur** | 1 | 4 | 4 | 🟡 | SLA hébergeur, monitoring externe (Uptime Robot) |
| INF-07 | **Saturation de la RAM / CPU** | 2 | 2 | 4 | 🟡 | Limites mémoire Docker (`mem_limit`), monitoring des ressources |

### Risques Applicatifs

| ID | Risque | P | I | Criticité | Niveau | Mesures de mitigation |
|---|---|---|---|---|---|---|
| APP-01 | **Régression après déploiement** | 3 | 3 | 9 | 🟠 | Tests unitaires + E2E en CI, stratégie de rollback (tag `previous`) |
| APP-02 | **Données utilisateurs corrompues suite à migration** | 2 | 3 | 6 | 🟠 | Scripts de migration versionnés, backup avant migration, tests sur staging |
| APP-03 | **Accès non autorisé aux fonctions d'administration** | 2 | 4 | 8 | 🟠 | Vérification des rôles côté backend (middleware), tests d'autorisation |
| APP-04 | **Upload de fichiers malveillants** | 2 | 3 | 6 | 🟠 | Validation MIME type, taille limitée (1MB), scan antivirus (ClamAV) |
| APP-05 | **Fuite de données via les logs** | 2 | 3 | 6 | 🟠 | Pas d'email/password dans les logs, rotation + purge 30 jours |

### Risques RGPD

| ID | Risque | P | I | Criticité | Niveau | Mesures de mitigation |
|---|---|---|---|---|---|---|
| RGP-01 | **Non-respect du droit à l'effacement** | 2 | 4 | 8 | 🟠 | Fonctionnalité de suppression de compte avec anonymisation |
| RGP-02 | **Absence de consentement explicite** | 2 | 3 | 6 | 🟠 | Bannière de consentement, cases non pré-cochées, CGU claires |
| RGP-03 | **Non-notification CNIL en cas de violation** | 1 | 4 | 4 | 🟡 | Procédure documentée (notification < 72h), registre des incidents |
| RGP-04 | **Transfert de données hors UE** | 1 | 3 | 3 | 🟡 | Hébergeur européen, pas de services tiers hors UE sans accord |

### Risques Organisationnels

| ID | Risque | P | I | Criticité | Niveau | Mesures de mitigation |
|---|---|---|---|---|---|---|
| ORG-01 | **Perte d'accès aux secrets (tokens, clés SSH)** | 2 | 4 | 8 | 🟠 | Coffre-fort de mots de passe (Bitwarden), rotation trimestrielle |
| ORG-02 | **Absence d'un membre clé de l'équipe** | 2 | 3 | 6 | 🟠 | Documentation partagée, revue de code croisée, bus factor réduit |
| ORG-03 | **Non-respect des délais de livraison** | 2 | 3 | 6 | 🟠 | Planning Kanban, points d'avancement quotidiens, priorisation |
| ORG-04 | **Dépendance à un service tiers (DuckDNS)** | 2 | 3 | 6 | 🟠 | Alternative documentée (Cloudflare, No-IP), migration faisable en < 2h |

---

### Tableau de synthèse — Heatmap des risques

```
IMPACT
  4 │ SEC-01  SEC-02  SEC-07  APP-03  RGP-01  ORG-01 │ INF-01  APP-03
    │ (🟠8)  (🟠8)  (🟠8)  (🟠8)  (🟠8)  (🟠8)  │
  3 │ SEC-03  SEC-05  SEC-06  INF-02  INF-03  APP-01  │ INF-05  INF-06
    │ (🟠9)  (🟠6)  (🟠6)  (🟠6)  (🟠6)  (🟠9)  │ (🟡4)  (🟡4)
  2 │ SEC-04  SEC-08  INF-07  ORG-02  ORG-03  ORG-04 │
    │ (🟠6)  (🟠6)  (🟡4)  (🟠6)  (🟠6)  (🟠6)  │
  1 │ SEC-10                                          │
    │ (🟡3)                                           │
    └──────────────────────────────────────────────────
      1 (Rare)   2 (Possible)   3 (Probable)   4 (Quasi-certain)   PROBABILITÉ
```


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