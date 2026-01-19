package fr.imt.nord.fisa.ti.gatcha.common.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TokenVerifyResponse {
    private boolean status;
    private String username;
    private String message;
}