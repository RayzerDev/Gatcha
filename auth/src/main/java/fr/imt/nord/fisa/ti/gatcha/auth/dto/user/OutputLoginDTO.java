package fr.imt.nord.fisa.ti.gatcha.auth.dto.user;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OutputLoginDTO {
    private String token;
    private String message;
}
