package fr.imt.nord.fisa.ti.gatcha.invocation.config;

import org.bson.UuidRepresentation;
import org.springframework.boot.mongodb.autoconfigure.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration MongoDB pour supporter les UUID avec Spring Boot 4.
 * Configure le UuidRepresentation en STANDARD pour éviter les erreurs de codec.
 */
@Configuration
public class MongoConfig {

    @Bean
    public MongoClientSettingsBuilderCustomizer customizer() {
        return builder -> builder.uuidRepresentation(UuidRepresentation.STANDARD);
    }
}
