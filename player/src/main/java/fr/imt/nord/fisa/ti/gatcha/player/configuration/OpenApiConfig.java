package fr.imt.nord.fisa.ti.gatcha.player.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.bson.BsonBinarySubType;
import org.bson.UuidRepresentation;
import org.bson.internal.UuidHelper;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.List;
import java.util.UUID;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(
            @Value("${openapi.server-url:}") String serverUrl
    ) {
        var api = new OpenAPI()
                .info(new Info()
                        .title("API Player")
                        .version("1.0")
                        .description("Documentation de l'API Player")).components(new Components()
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

    // Mongo UUID mapping beans kept here to avoid extra config files
    // Driver UUID representation is already set via spring.data.mongodb.uuid-representation=standard
    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(new BinaryToUuidConverter(), new UuidToBinaryConverter()));
    }

    static class BinaryToUuidConverter implements Converter<Binary, UUID> {
        @Override
        public UUID convert(Binary source) {
            if (source == null) {
                return null;
            }
            // Decode using the binary subtype to preserve the representation
            return UuidHelper.decodeBinaryToUuid(source.getData(), source.getType(), UuidRepresentation.STANDARD);
        }
    }

    static class UuidToBinaryConverter implements Converter<UUID, Binary> {
        @Override
        public Binary convert(UUID source) {
            if (source == null) {
                return null;
            }
            byte[] bytes = UuidHelper.encodeUuidToBinary(source, UuidRepresentation.STANDARD);
            return new Binary(BsonBinarySubType.UUID_STANDARD, bytes);
        }
    }
}
