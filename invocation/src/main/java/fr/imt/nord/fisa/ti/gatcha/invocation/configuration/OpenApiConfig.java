package fr.imt.nord.fisa.ti.gatcha.invocation.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
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
                        .title("API Invocation")
                        .version("1.0")
                        .description("Documentation de l'API Invocation"));

        if (serverUrl == null || serverUrl.isBlank()) {
            return api.servers(List.of(new Server().url(".")));
        }

        return api.servers(List.of(new Server().url(serverUrl)));
    }
}
