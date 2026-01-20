package fr.imt.nord.fisa.ti.gatcha.auth.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Réponse de connexion/enregistrement")
public class OutputLoginDTO {

    @Schema(description = "Token d'authentification encrypté", example = "$2a$10$...")
    private String token;

    @Schema(description = "Message de statut", example = "Login successful")
    private String message;
}
