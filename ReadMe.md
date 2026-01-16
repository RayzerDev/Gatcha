# 🎮 Projet Gatcha - (FA.TI.CI1.DA1.WAD) Web API et Data

Système de jeu Gatcha complet avec gestion d'authentification, de joueurs, de monstres, d'invocations et de combats.

## 📋 Table des matières

- [Équipe et Contribution](#-équipe-et-contribution)
- [TO DO](#-todo)
- [Architecture](#-architecture)
- [Installation et Démarrage](#-installation-et-démarrage)
- [Services et Ports](#-services-et-ports)
- [Structure du Projet](#-structure-du-projet)

## 👥 Équipe et Contribution

### FISA TI 28

- Maël DEMORY
- Louis KARAMUCKI

## ✅ TODO

### 🔐 API d'Authentification (Priorité 1 - OBLIGATOIRE)

#### Fonctionnalités Core

- [ ] **Endpoint POST `/register`** - Enregistrement nouvel utilisateur
    - [ ] Vérification non existence de l'identifiant en base MongoDB
    - [ ] Stockage identifiant + password en base MongoDB
    - [ ] Retour succès (201) ou erreur (400 si déjà existant)

- [ ] **Endpoint POST `/login`** - Authentification avec identifiant/password
    - [ ] Vérification identifiant + password en base MongoDB
    - [ ] Génération token format: `username-date(YYYY/MM/DD)-heure(HH:mm:ss)`
    - [ ] Annulation des tokens existants pour cet utilisateur
    - [ ] Stockage du token en base avec date d'expiration (maintenant + 1h)
    - [ ] Retour du token en cas de succès (201) ou erreur (400 si échec)

- [ ] **Endpoint POST `/verify`** - Vérification d'un token
    - [ ] Vérification de la validité du token (non expiré)
    - [ ] Si valide: retourner le username + renouveler expiration (+1h) code 200
    - [ ] Si expiré: retourner erreur 401

#### Tests

- [ ] Tests unitaires endpoint `/register`
- [ ] Tests unitaires endpoint `/login`
- [ ] Tests unitaires endpoint `/verify`
- [ ] Tests de génération de token
- [ ] Tests de renouvellement d'expiration

---

### 🐳 Infrastructure Docker ✅

- [x] Docker Compose pour lancer TOUT le projet
- [x] Chaque API tourne dans un container
- [x] Chaque base MongoDB dans un container
- [x] Frontend dans un container
- [x] API Gateway Nginx
- [x] Réseau Docker partagé
- [x] README avec instructions de lancement

---

**📅 Dernière mise à jour : 16 janvier 2026**

**🎯 Ordre de Priorité d'Implémentation:**

- [x] ✅ Infrastructure Docker
- [ ] 🔐 API Auth
- [ ] 👤 API Joueur
- [ ] 👾 API Monstres
- [ ] ✨ API Invocations
- [ ] 🎨 Frontend
- [ ] ⚔️ API Combat (BONUS)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              GATCHA APPLICATION                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                                     │
│                            http://localhost:3000                                    │
│                      (Interface d'invocation de monstres)                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP Requests
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               API GATEWAY (NGINX)                                   │
│                              http://localhost:8000                                  │
│                              (Routage des requêtes)                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        │               │               │               │               │
        ▼               ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   API AUTH   │ │  API PLAYER  │ │ API MONSTER  │ │API INVOCATION│ │  API COMBAT  │
│  Port: 8081  │ │  Port: 8082  │ │  Port: 8083  │ │  Port: 8084  │ │  Port: 8085  │
│  SpringBoot  │ │  SpringBoot  │ │  SpringBoot  │ │  SpringBoot  │ │  SpringBoot  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │
       │ Token          │ Token          │ Token          │ Token          │ Token
       │ Validation     │ Validation     │ Validation     │ Validation     │ Validation
       │◄───────────────┤◄───────────────┤◄───────────────┤◄───────────────┤
       │                │                │                │                │
       ▼                ▼                ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌───────────────┐ ┌─────────────────┐ ┌──────────────┐
│ MongoDB Auth │ │MongoDB Player│ │MongoDB Monster│ │MongoDBInvocation│ │MongoDB Combat│
│ Port: 27017  │ │ Port: 27018  │ │ Port: 27019   │ │ Port: 27020     │ │ Port: 27021  │
└──────────────┘ └──────────────┘ └───────────────┘ └─────────────────┘ └──────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│                     Docker Network: gatcha-network (bridge)                        │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Installation et Démarrage

### 1. Configuration des variables d'environnement

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifiez les variables si nécessaire (optionnel)

### 2. Lancer l'application complète

```bash
docker compose -f docker/docker-compose.yml -p gatcha up --build
```

Cette commande va :

- ✅ Construire toutes les images Docker des APIs
- ✅ Démarrer toutes les bases MongoDB
- ✅ Démarrer tous les services Spring Boot
- ✅ Créer le réseau Docker partagé

### 4. Vérifier que tout fonctionne

Attendez que tous les services soient démarrés (healthcheck OK). Vous pouvez vérifier avec :

```bash
docker compose -f docker/docker-compose.yml ps
```

Tous les services doivent avoir le statut `Up` et être `healthy`.

### 5. Accéder aux services

#### Frontend

- **Frontend Next.js** : http://localhost:3000

#### API Gateway

- **API Gateway (Point d'entrée unique)** : http://localhost:8000
- **Documentation des routes** : http://localhost:8000/ (page d'accueil)
- **Health check** : http://localhost:8000/health

#### Documentation Swagger (via le gateway)

- Auth : http://localhost:8000/api/auth/swagger-ui/index.html
- Player : http://localhost:8000/api/player/swagger-ui/index.html
- Monster : http://localhost:8000/api/monster/swagger-ui/index.html
- Invocation : http://localhost:8000/api/invocation/swagger-ui/index.html
- Combat : http://localhost:8000/api/combat/swagger-ui/index.html

#### APIs (accès direct)

- **API Auth** : http://localhost:8081
- **API Player** : http://localhost:8082
- **API Monster** : http://localhost:8083
- **API Invocation** : http://localhost:8084
- **API Combat** : http://localhost:8085

### 6. Arrêter l'application

```bash
docker compose -f docker/docker-compose.yml down
```

Pour supprimer également les volumes (données) :

```bash
docker compose -f docker/docker-compose.yml down -v
```

## 🔌 Services et Ports

| Service                | Type       | Port Interne | Port Externe | Description                      |
|------------------------|------------|--------------|--------------|----------------------------------|
| **front**              | Next.js    | 3000         | 3000         | Interface utilisateur            |
| **api-gateway**        | Nginx      | 80           | 8000         | Point d'entrée unique (Gateway)  |
| **api-auth**           | SpringBoot | 8080         | 8081         | API d'authentification           |
| **mongodb-auth**       | MongoDB    | 27017        | 27017        | Base de données Authentification |
| **api-player**         | SpringBoot | 8080         | 8082         | API de gestion des joueurs       |
| **mongodb-player**     | MongoDB    | 27017        | 27018        | Base de données Player           |
| **api-monster**        | SpringBoot | 8080         | 8083         | API de gestion des monstres      |
| **mongodb-monster**    | MongoDB    | 27017        | 27019        | Base de données Monster          |
| **api-invocation**     | SpringBoot | 8080         | 8084         | API d'invocation de monstres     |
| **mongodb-invocation** | MongoDB    | 27017        | 27020        | Base de données Invocation       |
| **api-combat**         | SpringBoot | 8080         | 8085         | API de combat (BONUS)            |
| **mongodb-combat**     | MongoDB    | 27017        | 27021        | Base de données Combat           |

### Notes Importantes

- **Chaque API a sa propre base MongoDB** pour respecter le principe de microservices
- **Ports MongoDB** : Le port interne est toujours 27017 (dans le container), les ports externes sont mappés
  différemment (27017, 27018, 27019, etc.)
- **Tous les ports sont configurables** via le fichier `.env`

## 📁 Structure du Projet

```
Gatcha/
├── docker/                             # Stack Docker Compose 
│   ├── docker-compose.yml              # Fichier d'application Docker Compose
│   ├── api.docker-compose.base.yml     # Fichier genérique pour le docker-compose des APIs
│   ├── api.Dockerfile                  # Dockerfile générique pour les APIs
│   └── front.Dockerfile│               # Dockerfile pour le frontend Next.js
├── gateway/                            # Config du gateway Nginx
│   ├── nginx.conf
│   └── index.html
├── ReadMe.md
├── auth/                               # API
├── player/
├── monster/
├── invocation/
├── combat/
└── front/                              # Frontend Next.js
```