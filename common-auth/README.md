# Module Common-Auth

Ce module contient les fonctionnalités communes pour la validation de tokens dans l'architecture microservices.

## Fonctionnalités

- **TokenValidationFilter** : Filtre pour valider les tokens dans les requêtes entrantes.
- **AuthServiceClient** : Client pour interagir avec le service d'authentification.
- **FilterConfig** : Configuration du filtre de validation des tokens.
- **TokenValidationException** : Exception personnalisée pour les erreurs de validation des tokens.
- **TokenVerifyResponse** : Classe de réponse pour la vérification des tokens.
- **SecurityContext** : Contexte de sécurité pour stocker les informations d'authentification durant la vie de la requête.

## Utilisation

### 1. Ajouter la dépendance dans votre build.gradle

```gradle
dependencies {
    implementation project(':common-auth')
}
```

### 2. Configurer settings.gradle

```gradle
include ':common-auth'
project(':common-auth').projectDir = file('../common-auth')
```

### 3. Ajouter la configuration dans application.properties

```properties
auth.service.url=${AUTH_SERVICE_URL:http://localhost:8080}
```
### 4. Ajouter des exclusions de routes dans votre contrôleur
Vous devez ajouter les routes à exclure de la validation des tokens dans la propriété `auth.filter.excluded.paths` de votre fichier `application.properties`.

```properties
auth.filter.excluded.paths=/public/**,/health
```

Des routes sont par défaut exclues :
- `/tokens/**`
- `/swagger-ui/**`
- `/users/**`
- `/api-docs/**`
- `/actuator/health`