package fr.imt.nord.fisa.ti.gatcha.auth.dto.token;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Réponse de vérification de token")
public class OutputVerifyDTO {

    @Schema(description = "Statut de validité du token", example = "true")
    private boolean status;

    @Schema(description = "Nom d'utilisateur associé au token", example = "john")
    private String username;

    @Schema(description = "Message de statut", example = "Token valid")
    private String message;
}
