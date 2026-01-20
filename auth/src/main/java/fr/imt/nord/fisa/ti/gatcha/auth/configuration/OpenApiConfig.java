package fr.imt.nord.fisa.ti.gatcha.auth.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration OpenAPI/Swagger pour la documentation de l'API.
 * <p>
 * La documentation est accessible à : <a href="http://localhost:8080/swagger-ui.html">...</a>
 */
@Configuration
public class OpenApiConfig {

    /**
     * En dev "standalone" (bootRun du module), on veut que Swagger UI appelle la même origine
     * (même host/port) => on utilise une URL relative.
     * <p>
     * En mode "gateway" (docker-compose), on force une URL absolue via env OPENAPI_SERVER_URL.
     */
    @Bean
    public OpenAPI customOpenAPI(
            @Value("${openapi.server-url:}") String serverUrl
    ) {
        var api = new OpenAPI()
                .info(new Info()
                        .title("API d'Authentification Gatcha")
                        .version("1.0.0")
                        .description("""
                                API de gestion de l'authentification pour le système Gatcha.
                                
                                Cette API permet de :
                                - Enregistrer de nouveaux utilisateurs
                                - Authentifier les utilisateurs existants
                                - Générer des tokens de session valables 1 heure
                                - Vérifier la validité des tokens
                                - Renouveler automatiquement les tokens valides
                                
                                Format du token : username-YYYY/MM/DD-HH:mm:ss (encrypté avec BCrypt)
                                
                                Les tokens sont automatiquement prolongés de 1 heure à chaque vérification réussie.
                                
                                Pour les endpoints protégés, utilisez le bouton 'Authorize' et entrez votre token.
                                """))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Entrez votre token d'authentification")
                        )
                );

        // Si vide -> URL relative, Swagger utilisera la même origine (évite les soucis de ports)
        if (serverUrl == null || serverUrl.isBlank()) {
            return api.servers(List.of(new Server().url(".")));
        }

        return api.servers(List.of(new Server().url(serverUrl)));
    }
}
