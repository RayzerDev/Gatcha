package fr.imt.nord.fisa.ti.gatcha.auth.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InputLoginDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
