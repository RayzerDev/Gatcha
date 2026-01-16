package fr.imt.nord.fisa.ti.gatcha.auth.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration OpenAPI/Swagger pour la documentation de l'API.
 * <p>
 * La documentation est accessible à : http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
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
                                """)
                );
    }
}
