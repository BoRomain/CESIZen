# CESIZen

CESIZen est une application full-stack conçue pour offrir une expérience utilisateur fluide pour l'accès à l'information et aux activités. Elle se compose de trois composants principaux : une API backend, un panneau d'administration et une application mobile.

## Structure du Projet

Le dépôt est un monorepo contenant les paquets suivants :

-   `./BackAPI/`: Un backend Node.js utilisant Express.js et l'ORM Prisma.
-   `./admin-panel/`: Une application React (Vite) pour l'administration.
-   `./cesizen-native/`: Une application mobile React Native (Expo).

## Démarrage

### Prérequis

-   Node.js (v18 ou supérieure recommandée)
-   npm ou yarn
-   Une base de données PostgreSQL

### Installation

1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/BoRomain/CESIZen
    cd CESIZen
    ```

2.  Installez les dépendances pour chaque paquet. Il est recommandé d'ouvrir trois terminaux distincts pour cela.

    -   **Pour l'API Backend :**
        ```bash
        cd BackAPI
        npm install
        ```

    -   **Pour le Panneau d'Administration :**
        ```bash
        cd admin-panel
        npm install
        ```

    -   **Pour l'Application Mobile :**
        ```bash
        cd cesizen-native
        npm install
        ```

### Configuration

Le backend nécessite un fichier `.env` avec la chaîne de connexion à la base de données.

1.  Accédez au répertoire `BackAPI` :
    ```bash
    cd BackAPI
    ```

2.  Créez un fichier `.env` en copiant l'exemple (s'il en existait un, ou créez-le de A à Z) :
    ```
    # .env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

3.  Exécutez les migrations de la base de données :
    ```bash
    npx prisma migrate dev
    ```

4.  (Optionnel) Remplissez la base de données avec des données initiales :
    ```bash
    npm run seed
    ```

### Lancement de l'Application

-   **API Backend (`BackAPI`):**
    ```bash
    # Depuis le répertoire BackAPI
    npm run dev
    ```
    Le serveur démarrera sur le port configuré (par ex., http://localhost:3000).

-   **Panneau d'Administration (`admin-panel`):**
    ```bash
    # Depuis le répertoire admin-panel
    npm run dev
    ```
    Le serveur de développement démarrera, généralement sur http://localhost:5173.

-   **Application Mobile (`cesizen-native`):**
    ```bash
    # Depuis le répertoire cesizen-native
    npm start
    ```
    Cela démarrera le serveur de développement Expo. Vous pouvez ensuite lancer l'application sur un émulateur Android, un simulateur iOS, ou sur votre appareil physique en utilisant l'application Expo Go.

## Scripts Disponibles

### BackAPI

-   `npm run dev`: Démarre le serveur de développement avec rechargement à chaud.
-   `npm run start`: Démarre l'application en production.
-   `npm test`: Lance la suite de tests.
-   `npm run seed`: Remplit la base de données.

### admin-panel

-   `npm run dev`: Démarre le serveur de développement Vite.
-   `npm run build`: Construit l'application pour la production.
-   `npm run lint`: Analyse le code source.

### cesizen-native

-   `npm start`: Démarre le serveur de développement Expo.
-   `npm run android`: Démarre l'application sur un appareil ou émulateur Android connecté.
-   `npm run ios`: Démarre l'application sur un simulateur iOS.
-   `npm run web`: Exécute l'application dans un navigateur web.
