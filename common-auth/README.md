# Module Common-Auth

Ce module contient les fonctionnalités communes pour la validation de tokens dans l'architecture microservices.

## Fonctionnalités

- **AuthServiceClient**: Client HTTP pour communiquer avec l'API Auth
- **TokenValidationInterceptor**: Interceptor Spring MVC pour valider automatiquement les tokens
- **TokenVerifyResponse**: DTO pour les réponses de validation
- **TokenValidationException**: Exception personnalisée pour les erreurs de validation

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
auth.service.url=http://localhost:8080
```

### 4. L'interceptor s'active automatiquement sur les routes `/api/**`

Les routes publiques peuvent être exclues avec `/api/public/**`

## Exemple d'utilisation

```java
@RestController
@RequestMapping("/api/protected")
public class MyController {
    
    @GetMapping("/data")
    public ResponseEntity<String> getData() {
        // Cette route est protégée par l'interceptor
        // Le token est validé automatiquement
        return ResponseEntity.ok("Protected data");
    }
    
    @GetMapping("/public/info")
    public ResponseEntity<String> getPublicInfo() {
        // Cette route serait exclue si configurée dans /api/public/**
        return ResponseEntity.ok("Public info");
    }
}
```