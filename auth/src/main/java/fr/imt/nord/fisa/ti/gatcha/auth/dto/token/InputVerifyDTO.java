package fr.imt.nord.fisa.ti.gatcha.auth.dto.token;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Requête de vérification de token")
public class InputVerifyDTO {

    @NotBlank(message = "Token cannot be blank")
    @Schema(description = "Token d'authentification à vérifier", example = "$2a$10$...", required = true)
    private String token;
}
