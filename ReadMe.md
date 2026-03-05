# 🎮 Projet Gatcha - (FA.TI.CI1.DA1.WAD) Web API et Data

Système de jeu Gatcha complet avec gestion d'authentification, de joueurs, de monstres, d'invocations et de combats.

## 📋 Table des matières

- [Équipe et Contribution](#-équipe-et-contribution)
- [Architecture](#-architecture)
- [Installation et Démarrage](#-installation-et-démarrage)
- [Services et Ports](#-services-et-ports)
- [Monitoring](#-monitoring)
- [Structure du Projet](#-structure-du-projet)

## 👥 Équipe et Contribution

### FISA TI 28

- Maël DEMORY
- Louis KARAMUCKI

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

#### Monitoring

- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3001
- **Alertmanager** : http://localhost:9093

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
| **api-auth**           | SpringBoot | 8081         | 8081         | API d'authentification           |
| **mongodb-auth**       | MongoDB    | 27017        | 27017        | Base de données Authentification |
| **api-player**         | SpringBoot | 8082         | 8082         | API de gestion des joueurs       |
| **mongodb-player**     | MongoDB    | 27017        | 27018        | Base de données Player           |
| **api-monster**        | SpringBoot | 8083         | 8083         | API de gestion des monstres      |
| **mongodb-monster**    | MongoDB    | 27017        | 27019        | Base de données Monster          |
| **api-invocation**     | SpringBoot | 8084         | 8084         | API d'invocation de monstres     |
| **mongodb-invocation** | MongoDB    | 27017        | 27020        | Base de données Invocation       |
| **api-combat**         | SpringBoot | 8085         | 8085         | API de combat (BONUS)            |
| **mongodb-combat**     | MongoDB    | 27017        | 27021        | Base de données Combat           |
| **prometheus**         | Monitoring | 9090         | 9090         | Collecte des métriques           |
| **grafana**            | Monitoring | 3000         | 3001         | Dashboard de monitoring          |
| **alertmanager**       | Monitoring | 9093         | 9093         | Gestion des alertes              |

### Notes Importantes

- **Chaque API a sa propre base MongoDB** pour respecter le principe de microservices
- **Ports MongoDB** : Le port interne est toujours 27017 (dans le container), les ports externes sont mappés
  différemment (27017, 27018, 27019, etc.)
- **Tous les ports sont configurables** via le fichier `.env`

## 📈 Monitoring

Le projet intègre une stack de monitoring complète via Docker Compose :

- **Prometheus** scrape les endpoints `/actuator/prometheus` de chaque microservice
- **Grafana** charge automatiquement la datasource Prometheus et le dashboard Gatcha
- **Alertmanager** reçoit les alertes Prometheus

### Alertes de disponibilité

Une règle d'alerte est configurée pour notifier uniquement lorsqu'un service applicatif est indisponible :

- **Alerte** : `ServiceDown`
- **Condition** : `up{job=~"gatcha-.*"} == 0`
- **Durée avant déclenchement** : 30 secondes

### URLs d'accès monitoring

- Prometheus : `http://localhost:9090`
- Grafana : `http://localhost:3001`
- Alertmanager : `http://localhost:9093`

### Accès Grafana

- Utilisateur par défaut : `admin`
- Mot de passe par défaut : `admin`
- Variables Docker disponibles : `GRAFANA_ADMIN_USER` et `GRAFANA_ADMIN_PASSWORD`

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
├── common/                             # Code partagé (ex: modèles, utils)
├── common-auth/                        # Code partagé spécifique à l'authentification (ex: Token verification)
└── front/                              # Frontend Next.js
```

---

## 🔍 Analyse qualité avec SonarQube

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- JDK 21 (pour les modules Java)
- Node.js 20+ (pour le frontend)
- `sonar-scanner` CLI pour le frontend : `npm install -g sonarqube-scanner`

### 1. Démarrer SonarQube

```powershell
.\sonar-analyze.ps1 -Start
```

Au **premier lancement**, un container Docker `sonar-init` s'exécute **automatiquement** et :

- 🔐 Change le mot de passe admin (`admin/admin` → `Admin1234!5678` par défaut)
- 📁 Crée les 8 projets SonarQube (`gatcha-auth`, `gatcha-combat`, etc.)
- 🎫 Génère un **token d'analyse global** persisté dans le volume Docker `sonar_token`

Dès le deuxième lancement, le marqueur `.initialized` dans le volume empêche toute ré-initialisation. Le token est rechargé automatiquement.

> **Mot de passe admin personnalisé** : définir `SONAR_ADMIN_PASSWORD` dans un fichier `.env` à la racine :
> ```
> SONAR_ADMIN_PASSWORD=MonMotDePasse!
> ```

> **Pour forcer une ré-initialisation** (après `down -v`) : supprimer et recréer les volumes Docker.

### 2. Lancer les analyses

Aucune configuration manuelle de token nécessaire, il est chargé automatiquement depuis le volume Docker :

```powershell
# Un seul module Java
.\sonar-analyze.ps1 -Module auth
.\sonar-analyze.ps1 -Module combat
.\sonar-analyze.ps1 -Module monster
# etc.

# Le frontend
.\sonar-analyze.ps1 -Module front

# Tous les modules d'un coup
.\sonar-analyze.ps1 -All

# Avec token explicite (prioritaire sur le volume Docker)
.\sonar-analyze.ps1 -All -Token squ_VOTRE_TOKEN
```

### 3. Consulter les résultats

Ouvrez **http://localhost:9000** et accédez aux projets :

| Projet | Clé SonarQube |
|--------|--------------|
| Auth | `gatcha-auth` |
| Combat | `gatcha-combat` |
| Common | `gatcha-common` |
| Common-Auth | `gatcha-common-auth` |
| Invocation | `gatcha-invocation` |
| Monster | `gatcha-monster` |
| Player | `gatcha-player` |
| Frontend | `gatcha-front` |

### 4. Arrêter SonarQube

```powershell
.\sonar-analyze.ps1 -Stop
```
