package fr.imt.nord.fisa.ti.gatcha.auth.dto.token;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OutputVerifyDTO {
    private boolean status;
    private String username;
    private String message;
}
