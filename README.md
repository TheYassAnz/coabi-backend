# COABI - Backend

## Description

Ce projet constitue la partie backend de l'application COABI. Il fournit les API nécessaires pour gérer les fonctionnalités principales de l'application.

## Prérequis

- **Node.js** (version >= 14.x)
- **npm**
- **Postman** ([Lien du Workspace Postman](https://coabi-team.postman.co/workspace/fcba6f8d-1708-46a4-92d1-3cbe1b2a12d4))

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/TheYassAnz/coabi-backend.git
   cd coabi-backend
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :

   - Créez un fichier `.env` à la racine du projet.
   - Ajoutez les variables nécessaires (voir `.env.dist`).

4. Lancez le serveur de développement :
   ```bash
   npm start
   ```

## Scripts disponibles

- `npm start` : Démarre l'application en mode production.

## Structure du projet

```
/.husky
/node_modules
/src
  /middleware
  /controllers
  /models
  /routes
  app.ts
.env
.env.dist
.prettierrc
commitlint.config.js
eslint.config.js
package-lock.json
package.json
README.md
server.ts
tsconfig.json
```

## Auteurs

- **Yassine ANZAR BASHA**
- **Abubakar ALIEV**
- **Quentin DOULCET**
- **Guillaume EAP**
