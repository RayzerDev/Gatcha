package fr.imt.nord.fisa.ti.gatcha.monster.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(
            @Value("${openapi.server-url:}") String serverUrl
    ) {
        var api = new OpenAPI()
                .info(new Info()
                        .title("API Monster")
                        .version("1.0")
                        .description("Documentation de l'API Monster")).components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Entrez votre token d'authentification")
                        )
                ).addSecurityItem(new SecurityRequirement().addList("bearerAuth"));

        if (serverUrl == null || serverUrl.isBlank()) {
            return api.servers(List.of(new Server().url(".")));
        }

        return api.servers(List.of(new Server().url(serverUrl)));
    }
}
