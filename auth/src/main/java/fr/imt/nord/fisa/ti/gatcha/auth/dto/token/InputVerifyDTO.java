package fr.imt.nord.fisa.ti.gatcha.auth.dto.token;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InputVerifyDTO {
    @NotBlank
    private String token;
}
