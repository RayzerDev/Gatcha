package fr.imt.nord.fisa.ti.gatcha.auth.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    /**
     * En dev "standalone" (bootRun du module), on veut que Swagger UI appelle la même origine
     * (même host/port) => on utilise une URL relative.
     *
     * En mode "gateway" (docker-compose), on force une URL absolue via env OPENAPI_SERVER_URL.
     */
    @Bean
    public OpenAPI customOpenAPI(
            @Value("${openapi.server-url:}") String serverUrl
    ) {
        var api = new OpenAPI()
                .info(new Info()
                        .title("API Auth")
                        .version("1.0")
                        .description("Documentation de l'API d'authentification"));

        // Si vide -> URL relative, Swagger utilisera la même origine (évite les soucis de ports)
        if (serverUrl == null || serverUrl.isBlank()) {
            return api.servers(List.of(new Server().url(".")));
        }

        return api.servers(List.of(new Server().url(serverUrl)));
    }
}
