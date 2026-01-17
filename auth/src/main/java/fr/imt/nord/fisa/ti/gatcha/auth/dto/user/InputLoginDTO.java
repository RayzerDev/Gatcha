package fr.imt.nord.fisa.ti.gatcha.auth.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Données de connexion utilisateur")
public class InputLoginDTO {

    @NotBlank(message = "Username cannot be blank")
    @Schema(description = "Nom d'utilisateur", example = "john", required = true)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Schema(description = "Mot de passe", example = "password123", required = true)
    private String password;
}
